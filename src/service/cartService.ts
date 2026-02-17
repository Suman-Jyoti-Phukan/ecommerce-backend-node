import { prisma } from "../db/prisma";
import { couponService } from "./couponService";
import { formatCartItems } from "../lib/formatter";

interface AddToCartInput {
  userId: string;
  productId?: string;
  variantId?: string;
  quantity?: number;
}

interface UpdateCartInput {
  userId: string;
  productId?: string;
  variantId?: string;
  quantity: number;
}

export class CartService {
  async addToCart(input: AddToCartInput) {
    const { userId, productId, variantId, quantity = 1 } = input;

    let finalProductId = productId;

    if (variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: variantId }
      });
      if (!variant) throw new Error("Variant not found");

      if (finalProductId && variant.productId !== finalProductId) {
        throw new Error("Variant does not belong to this product");
      }

      finalProductId = variant.productId;
    }

    if (!finalProductId) {
      throw new Error("Product ID is required if no variant is provided");
    }

    const product = await prisma.product.findUnique({
      where: { id: finalProductId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (!variantId && product.hasVariants) {
      throw new Error("Please select a variant (size/color)");
    }

    // Check existing item using findFirst because variantId might be null and DB unique constraint handling varies
    const existingItem = await prisma.cart.findFirst({
      where: {
        userId,
        productId: finalProductId,
        variantId: variantId || null
      }
    });

    if (existingItem) {
      return await prisma.cart.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          product: true,
          variant: true
        },
      });
    }

    return await prisma.cart.create({
      data: {
        userId,
        productId: finalProductId,
        variantId: variantId || null,
        quantity,
      },
      include: {
        product: true,
        variant: true
      },
    });
  }

  async getCartItems(userId: string) {
    return await prisma.cart.findMany({
      where: { userId },
      include: {
        product: true,
        variant: true
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateCartQuantity(input: UpdateCartInput) {
    let { userId, productId, variantId, quantity } = input;

    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    if (!productId && variantId) {
      const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
      if (variant) productId = variant.productId;
    }

    if (!productId) throw new Error("Product ID is required");

    const cartItem = await prisma.cart.findFirst({
      where: { userId, productId, variantId: variantId || null }
    });

    if (!cartItem) throw new Error("Item not found in cart");

    return await prisma.cart.update({
      where: { id: cartItem.id },
      data: { quantity },
      include: {
        product: true,
        variant: true
      },
    });
  }

  async removeFromCart(userId: string, productId?: string, variantId?: string) {
    if (!productId && variantId) {
      const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
      if (variant) productId = variant.productId;
    }

    if (!productId) throw new Error("Product ID is required");

    const cartItem = await prisma.cart.findFirst({
      where: { userId, productId, variantId: variantId || null }
    });

    if (!cartItem) throw new Error("Item not found");

    return await prisma.cart.delete({
      where: { id: cartItem.id },
    });
  }

  async clearCart(userId: string) {
    return await prisma.cart.deleteMany({
      where: { userId },
    });
  }

  async getCartCount(userId: string) {
    return await prisma.cart.count({
      where: { userId },
    });
  }

  async getCartTotal(userId: string, couponCode?: string) {
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { product: true, variant: true },
    });

    const total = cartItems.reduce((sum, item) => {
      let price = item.product.sellingPrice || 0;
      if (item.variant && item.variant.sellingPrice) {
        price = item.variant.sellingPrice;
      }
      return sum + price * item.quantity;
    }, 0);

    let discountAmount = 0;
    let coupon = null;

    if (couponCode) {
      try {
        const validatedCoupon = await couponService.validateCouponForCart(
          couponCode,
          total,
          cartItems.map(item => ({
            productId: item.productId,
            variantId: item.variantId || undefined,
            // categoryId would be needed if coupon is category based, 
            // but validateCouponForCart in couponService currently only checks productIds/variantIds.
          }))
        );

        coupon = validatedCoupon;

        if (validatedCoupon.type === "FIXED") {
          discountAmount = validatedCoupon.value;
        } else if (validatedCoupon.type === "PERCENTAGE") {
          discountAmount = (total * validatedCoupon.value) / 100;
        }

        if (validatedCoupon.maxDiscount && discountAmount > validatedCoupon.maxDiscount) {
          discountAmount = validatedCoupon.maxDiscount;
        }
      } catch (error: any) {
        // If coupon is invalid, we can either throw or just not apply it.
        // Usually, in getCartTotal, if a code is explicitly passed, we should probably inform if it's invalid.
        // But throwing might break the whole cart view. 
        // Let's re-throw so the controller can handle it.
        throw error;
      }
    }

    return {
      itemCount: cartItems.length,
      total,
      discountAmount,
      finalTotal: Math.max(0, total - discountAmount),
      coupon,
      items: formatCartItems(cartItems),
    };
  }
}
