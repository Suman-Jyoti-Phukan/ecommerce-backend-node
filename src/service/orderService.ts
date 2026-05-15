import crypto from "crypto";
import { prisma } from "../db/prisma";
import { getRazorpay } from "../lib/razorpay";
import env from "../config/env";

import { OrderStatus, PaymentStatus } from "../generated/prisma/enums";

import { CustomError } from "../middleware/errorHandler";

import { couponService } from "./couponService";

export interface CreateOrderItemData {
  productId?: string;
  variantId?: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface CreateOrderData {
  userId: string;
  addressId: string;
  items: CreateOrderItemData[];
  paymentMethod: string;
  paymentId?: string;
  couponCode?: string;
  deliveryCharge?: number;
  razorpayOrderId?: string;
}

export interface OrderAmountCalculation {
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  orderItemsData: any[];
  resolvedCouponId?: number;
}

export const calculateOrderAmount = async (data: {
  userId: string;
  addressId: string;
  items: CreateOrderItemData[];
  couponCode?: string;
  deliveryCharge?: number;
}): Promise<OrderAmountCalculation> => {
  const { userId, addressId, items, couponCode, deliveryCharge = 0 } = data;

  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.userId !== userId) {
    throw new CustomError("Invalid address", 400);
  }

  let totalAmount = 0;

  const orderItemsData: {
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
    size: string | undefined;
    color: string | undefined;
  }[] = [];


  for (const item of items) {
    let finalProductId = item.productId;
    let finalSize = item.size;
    let finalColor = item.color;
    let price = 0;
    let availableQuantity = 0;

    if (item.variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId }
      });

      if (!variant) throw new CustomError(`Variant not found: ${item.variantId}`, 404);

      if (finalProductId && variant.productId !== finalProductId) {
        throw new CustomError("Variant mismatch", 400);
      }

      finalProductId = variant.productId;

      finalSize = variant.size || finalSize;

      finalColor = variant.color || finalColor;

      price = variant.sellingPrice || variant.maximumRetailPrice || 0;

      availableQuantity = variant.quantity;

      if (availableQuantity < item.quantity) {
        throw new CustomError(`Insufficient stock for variant: ${variant.sku}`, 400);
      }
    }

    if (!finalProductId) {
      throw new CustomError("Product ID is required if no variant is provided", 400);
    }

    const product = await prisma.product.findUnique({
      where: { id: finalProductId },
    });

    if (!product) {
      throw new CustomError(`Product not found: ${finalProductId}`, 404);
    }

    if (!item.variantId) {
      if (product.hasVariants) {
        throw new CustomError(`Product ${product.productName} requires a variant selection`, 400);
      }
      price = product.sellingPrice || product.maximumRetailPrice || 0;
      availableQuantity = product.quantity;

      if (availableQuantity < item.quantity) {
        throw new CustomError(`Insufficient stock for product: ${product.productName}`, 400);
      }
    }

    totalAmount += price * item.quantity;

    orderItemsData.push({
      productId: finalProductId,
      variantId: item.variantId || undefined,
      quantity: item.quantity,
      price: price,
      size: finalSize,
      color: finalColor,
    });
  }


  let discountAmount = 0;

  let resolvedCouponId: number | undefined = undefined;

  if (couponCode) {

    const coupon = await couponService.getCouponByCode(couponCode);


    if (coupon.minOrderValue && totalAmount < coupon.minOrderValue) {
      throw new CustomError(
        `Minimum order value must be ${coupon.minOrderValue} to apply this coupon`,
        400
      );
    }


    const existingUsage = await prisma.couponUser.findUnique({
      where: { couponId_userId: { couponId: coupon.id, userId } },
    });

    if (existingUsage) {
      throw new CustomError("You have already used this coupon", 400);
    }

    if (coupon.type === "FIXED") {
      discountAmount = coupon.value;
    } else if (coupon.type === "PERCENTAGE") {
      discountAmount = (totalAmount * coupon.value) / 100;
    }
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }

    resolvedCouponId = coupon.id;
  }

  const finalAmount = Math.max(0, totalAmount - discountAmount + (deliveryCharge || 0));

  return {
    totalAmount,
    discountAmount,
    finalAmount,
    orderItemsData,
    resolvedCouponId
  };
};

export const createOrder = async (data: CreateOrderData) => {
  const { userId, addressId, items, paymentMethod, paymentId, couponCode, deliveryCharge = 0, razorpayOrderId } = data;

  const {
    totalAmount,
    discountAmount,
    finalAmount,
    orderItemsData,
    resolvedCouponId
  } = await calculateOrderAmount({ userId, addressId, items, couponCode, deliveryCharge });

  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // For COD orders, payment status is always PENDING regardless of paymentId
  const isCOD = paymentMethod === "COD" || paymentMethod === "Cash on Delivery";
  const paymentStatus = isCOD ? PaymentStatus.PENDING : (paymentId ? PaymentStatus.COMPLETED : PaymentStatus.PENDING);

  const order = await prisma.$transaction(async (tx) => {

    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        userId,
        addressId,
        totalAmount,
        discountAmount,
        deliveryCharge,
        finalAmount,
        paymentMethod,
        paymentId,
        razorpayOrderId,
        paymentStatus,
        couponId: resolvedCouponId,
        status: OrderStatus.PENDING,
        orderItems: {
          create: orderItemsData.map((item) => ({
            ...item,
            status: OrderStatus.PENDING,
            orderItemHistories: {
              create: {
                status: OrderStatus.PENDING,
                comment: "Order item created",
              },
            },
          })),
        },
        history: {
          create: {
            status: OrderStatus.PENDING,
            comment: "Order created",
          },
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
            variant: true,
            orderItemHistories: {
              orderBy: { createdAt: 'desc' }
            }
          }
        },
        history: true,
      },
    });


    for (const item of items) {
      if (item.variantId) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { quantity: { decrement: item.quantity } }
        });
      } else {
        await tx.product.update({
          where: { id: item.productId || orderItemsData[items.indexOf(item)].productId },
          data: { quantity: { decrement: item.quantity } }
        });
      }
    }


    if (resolvedCouponId) {
      await tx.couponUser.create({
        data: {
          couponId: resolvedCouponId,
          userId,
          usedAt: new Date(),
        },
      });
    }

    return newOrder;
  });

  return order;
};

/**
 * Creates a Razorpay order, reserves stock, and saves a snapshot of the
 * calculated amounts so that verification doesn't need to recalculate.
 */
export const createRazorpayOrder = async (data: {
  userId: string;
  addressId: string;
  items: CreateOrderItemData[];
  couponCode?: string;
  deliveryCharge?: number;
}) => {
  const { userId, addressId, items, couponCode, deliveryCharge = 0 } = data;

  const {
    totalAmount,
    discountAmount,
    finalAmount,
    orderItemsData,
    resolvedCouponId
  } = await calculateOrderAmount({ userId, addressId, items, couponCode, deliveryCharge });

  if (finalAmount <= 0) {
    throw new CustomError("Order amount must be greater than zero", 400);
  }

  const options = {
    amount: Math.round(finalAmount * 100), // Razorpay expects amount in paise
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  };

  let razorpayOrder: any;
  try {
    razorpayOrder = await getRazorpay().orders.create(options);
  } catch (error: any) {
    throw new CustomError(`Razorpay Order Creation Failed: ${error.message}`, 500);
  }

  // Reserve stock inside a transaction and save the snapshot
  await prisma.$transaction(async (tx) => {
    // Decrement stock for each item
    for (const item of items) {
      if (item.variantId) {
        const variant = await tx.productVariant.findUnique({ where: { id: item.variantId } });
        if (!variant || variant.quantity < item.quantity) {
          throw new CustomError(`Insufficient stock for variant: ${item.variantId}`, 400);
        }
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { quantity: { decrement: item.quantity } },
        });
      } else {
        const productId = item.productId || orderItemsData[items.indexOf(item)]?.productId;
        const product = await tx.product.findUnique({ where: { id: productId } });
        if (!product || product.quantity < item.quantity) {
          throw new CustomError(`Insufficient stock for product: ${productId}`, 400);
        }
        await tx.product.update({
          where: { id: productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }
    }

    // Reserve the coupon usage so it can't be used again during the payment window
    if (resolvedCouponId) {
      await tx.couponUser.create({
        data: {
          couponId: resolvedCouponId,
          userId,
          usedAt: null, // Will be set on order creation
        },
      });
    }

    // Save the snapshot for later use during verification (30 min expiry)
    await (tx as any).pendingRazorpayOrder.create({
      data: {
        razorpayOrderId: razorpayOrder.id,
        userId,
        addressId,
        itemsSnapshot: items,
        couponCode: couponCode || null,
        deliveryCharge,
        totalAmount,
        discountAmount,
        finalAmount,
        resolvedCouponId,
        orderItemsData,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      },
    });
  });

  return {
    ...razorpayOrder,
    key_id: env.RAZORPAY_KEY_ID,
  };
};

/**
 * Verifies the Razorpay payment signature, then creates the actual order
 * using the saved snapshot (no recalculation, no re-reserving stock).
 */
export const verifyAndPlaceRazorpayOrder = async (data: {
  userId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  const { userId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

  // 1. Verify signature
  verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

  // 2. Look up the saved snapshot
  const pending = await (prisma as any).pendingRazorpayOrder.findUnique({
    where: { razorpayOrderId: razorpay_order_id },
  });

  if (!pending) {
    throw new CustomError("No pending order found for this Razorpay order", 404);
  }

  if (pending.isUsed) {
    throw new CustomError("This payment has already been processed", 400);
  }

  if (pending.userId !== userId) {
    throw new CustomError("Unauthorized: order belongs to a different user", 403);
  }

  if (new Date() > new Date(pending.expiresAt)) {
    throw new CustomError("Payment session has expired. Please place a new order.", 400);
  }

  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const orderItemsData = pending.orderItemsData as any[];

  const order = await prisma.$transaction(async (tx) => {
    // Mark the pending order as used
    await (tx as any).pendingRazorpayOrder.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: { isUsed: true },
    });

    // Update coupon usedAt timestamp if a coupon was reserved
    if (pending.resolvedCouponId) {
      await tx.couponUser.updateMany({
        where: {
          couponId: pending.resolvedCouponId,
          userId,
          usedAt: null,
        },
        data: { usedAt: new Date() },
      });
    }

    // Create the order using snapshot data (no recalculation)
    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        userId,
        addressId: pending.addressId,
        totalAmount: pending.totalAmount,
        discountAmount: pending.discountAmount,
        deliveryCharge: pending.deliveryCharge,
        finalAmount: pending.finalAmount,
        paymentMethod: "Razorpay",
        paymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        paymentStatus: PaymentStatus.COMPLETED,
        couponId: pending.resolvedCouponId,
        status: OrderStatus.PENDING,
        orderItems: {
          create: orderItemsData.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId || undefined,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color,
            status: OrderStatus.PENDING,
            orderItemHistories: {
              create: {
                status: OrderStatus.PENDING,
                comment: "Order item created",
              },
            },
          })),
        },
        history: {
          create: {
            status: OrderStatus.PENDING,
            comment: "Order created via Razorpay payment",
          },
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
            variant: true,
            orderItemHistories: {
              orderBy: { createdAt: 'desc' }
            }
          }
        },
        history: true,
      },
    });

    // Stock was already decremented during initialization — no need to do it again

    return newOrder;
  });

  return order;
};

/**
 * Releases reserved stock for expired/failed pending Razorpay orders.
 * Can be called periodically (e.g. cron) or on-demand.
 */
export const releaseExpiredReservations = async () => {
  const expired = await (prisma as any).pendingRazorpayOrder.findMany({
    where: {
      isUsed: false,
      expiresAt: { lt: new Date() },
    },
  });

  for (const pending of expired) {
    const items = pending.itemsSnapshot as CreateOrderItemData[];
    const orderItemsData = pending.orderItemsData as any[];

    await prisma.$transaction(async (tx) => {
      // Restore stock
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { quantity: { increment: item.quantity } },
          });
        } else {
          const productId = item.productId || orderItemsData[i]?.productId;
          await tx.product.update({
            where: { id: productId },
            data: { quantity: { increment: item.quantity } },
          });
        }
      }

      // Release coupon reservation
      if (pending.resolvedCouponId) {
        await tx.couponUser.deleteMany({
          where: {
            couponId: pending.resolvedCouponId,
            userId: pending.userId,
            usedAt: null,
          },
        });
      }

      // Mark as used so we don't process it again
      await (tx as any).pendingRazorpayOrder.update({
        where: { id: pending.id },
        data: { isUsed: true },
      });
    });
  }

  return { released: expired.length };
};

export const verifyRazorpaySignature = (
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
) => {
  if (!env.RAZORPAY_KEY_SECRET) {
    throw new CustomError("Razorpay secret key not configured", 500);
  }
  const hmac = crypto.createHmac("sha256", env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generatedSignature = hmac.digest("hex");

  if (generatedSignature !== razorpay_signature) {
    throw new CustomError("Invalid payment signature", 400);
  }

  return true;
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  comment?: string,
  userId?: string
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new CustomError("Order not found", 404);
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: {
        status,
      },
    });

    await tx.orderHistory.create({
      data: {
        orderId,
        status,
        comment,
        createdBy: userId,
      },
    });


    if (status === OrderStatus.CANCELLED) {
      const orderItems = await tx.orderItem.findMany({
        where: { orderId },
      });

      for (const item of orderItems) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { quantity: { increment: item.quantity } },
          });
        } else {
          await tx.product.update({
            where: { id: item.productId },
            data: { quantity: { increment: item.quantity } },
          });
        }
      }
    }

    if (status === OrderStatus.REFUNDED) {
      const orderItemsWithReturns = await tx.orderItem.findMany({
        where: { orderId },
        include: {
          returns: {
            where: {
              status: "COMPLETED",
              inventoryRestored: false,
            },
          },
        },
      });

      for (const item of orderItemsWithReturns) {
        for (const ret of item.returns) {
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { quantity: { increment: item.quantity } },
            });
          } else {
            await tx.product.update({
              where: { id: item.productId },
              data: { quantity: { increment: item.quantity } },
            });
          }

          await tx.return.update({
            where: { id: ret.id },
            data: { inventoryRestored: true },
          });
        }
      }
    }
  });

  return getOrderById(orderId);
};

export const updateOrderItemStatus = async (
  orderItemId: string,
  status: OrderStatus,
  comment?: string,
  userId?: string
) => {
  const orderItem = await prisma.orderItem.findUnique({
    where: { id: orderItemId },
    include: { order: true },
  });

  if (!orderItem) {
    throw new CustomError("Order item not found", 404);
  }

  await prisma.$transaction(async (tx) => {
    await tx.orderItem.update({
      where: { id: orderItemId },
      data: {
        status,
        deliveredAt: status === OrderStatus.DELIVERED ? new Date() : orderItem.deliveredAt,
      },
    });

    await (tx as any).orderItemHistory.create({
      data: {
        orderItemId,
        status,
        comment,
        createdBy: userId,
      },
    });


    const allItems = await tx.orderItem.findMany({
      where: { orderId: orderItem.orderId },
    });

    const statuses = allItems.map((item) => item.status);

    const uniqueStatuses = [...new Set(statuses)];

    if (uniqueStatuses.length === 1 && uniqueStatuses[0] === status) {

      await tx.order.update({
        where: { id: orderItem.orderId },
        data: { status },
      });

      await tx.orderHistory.create({
        data: {
          orderId: orderItem.orderId,
          status,
          comment: `Main order status automatically updated to ${status} as all items are now ${status}`,
          createdBy: "SYSTEM",
        },
      });
    } else if (status === OrderStatus.PROCESSING || status === OrderStatus.SHIPPED || status === OrderStatus.DELIVERED) {

    }
  });

  return getOrderById(orderItem.orderId);
};

export const getOrderById = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          product: true,
          variant: true,
          orderItemHistories: {
            orderBy: { createdAt: 'desc' }
          }
        }
      },
      history: {
        orderBy: { createdAt: 'desc' }
      },
      address: true,
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          altPhone: true
        }
      }
    }
  });

  if (!order) {
    throw new CustomError("Order not found", 404);
  }

  return order;
}

export const getUserOrders = async (userId: string, page?: number, limit?: number) => {
  const skip = (page && limit) ? (page - 1) * limit : undefined;
  const take = limit || undefined;

  const orders = await prisma.order.findMany({
    where: { userId },
    skip,
    take,
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: {
        include: {
          product: true,
          variant: true,
          orderItemHistories: {
            orderBy: { createdAt: 'desc' }
          }
        }
      },
      _count: {
        select: { orderItems: true }
      }
    }
  });

  const total = await prisma.order.count({ where: { userId } });

  return {
    orders,
    pagination: {
      total,
      page,
      limit,
      totalPages: limit ? Math.ceil(total / limit) : 1
    }
  };
}

export const getAllOrders = async (page?: number, limit?: number, status?: OrderStatus) => {
  const where = status ? { status } : {};

  const queryOptions: any = {
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: {
        include: {
          product: true,
          variant: true,
          orderItemHistories: {
            orderBy: { createdAt: 'desc' }
          }
        }
      },
      history: {
        orderBy: { createdAt: 'desc' }
      },
      user: {
        select: {
          fullName: true,
          email: true,
          phone: true,
          altPhone: true

        }
      },
      address: true,
      _count: {
        select: { orderItems: true }
      }
    }
  };

  if (page && limit) {
    queryOptions.skip = (page && limit) ? (page - 1) * limit : undefined;
    queryOptions.take = limit;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany(queryOptions),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    pagination: {
      total,
      page: page || 1,
      limit: limit || total,
      totalPages: limit ? Math.ceil(total / limit) : 1
    }
  };
}
