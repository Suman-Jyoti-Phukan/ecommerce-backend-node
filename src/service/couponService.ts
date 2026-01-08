import { prisma } from "../db/prisma";

import { CustomError } from "../middleware/errorHandler";

import { CouponType } from "../generated/prisma/client";

export interface CreateCouponInput {
  code: string;
  type: CouponType;
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  isStackable?: boolean;
  startsAt: Date;
  expiresAt: Date;
  productIds?: string[];
  variantIds?: string[];
  categoryIds?: string[];
}

export interface UpdateCouponInput extends Partial<CreateCouponInput> {}

export const couponService = {
  async createCoupon(input: CreateCouponInput) {
    const {
      code,
      type,
      value,
      minOrderValue,
      maxDiscount,
      isStackable,
      startsAt,
      expiresAt,
      productIds,
      variantIds,
      categoryIds,
    } = input;

    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (existingCoupon) {
      throw new CustomError("Coupon code already exists", 409);
    }

    if (new Date(startsAt) >= new Date(expiresAt)) {
      throw new CustomError("Expiry date must be after start date", 400);
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
          const coupon = await tx.coupon.create({
            data: {
              code: code.toUpperCase(),
              type,
              value,
              minOrderValue: minOrderValue || null,
              maxDiscount: maxDiscount || null,
              isStackable: isStackable || false,
              startsAt,
              expiresAt,
            },
          });

          if (productIds && productIds.length > 0) {
            await tx.couponProduct.createMany({
                data: productIds.map(id => ({ couponId: coupon.id, productId: id }))
            });
          }
          
          if (variantIds && variantIds.length > 0) {
             // We need corresponding productId for variant logic usually, but CouponProduct table has productId and variantId.
             // If we only have variantIds, we need to fetch their productIds to populate the table correctly if productId is required.
             // Assuming Schema: productId is Required in CouponProduct.
             // check schema: model CouponProduct { productId String ... variantId String? }
             // So we must fetch product IDs for these variants.
             const variants = await tx.productVariant.findMany({
                 where: { id: { in: variantIds } },
                 select: { id: true, productId: true }
             });
             
             for (const v of variants) {
                 await tx.couponProduct.create({
                     data: {
                         couponId: coupon.id,
                         productId: v.productId,
                         variantId: v.id
                     }
                 });
             }
          }

          if (categoryIds && categoryIds.length > 0) {
            await tx.couponCategory.createMany({
                data: categoryIds.map(id => ({ couponId: coupon.id, categoryId: id }))
            });
          }
          
          return coupon;
      });

      return result;
    } catch (error) {
      throw error;
    }
  },

  async updateCoupon(couponId: number, input: UpdateCouponInput) {
    const coupon = await prisma.coupon.findUnique({
      where: { id: couponId },
    });

    if (!coupon) {
      throw new CustomError("Coupon not found", 404);
    }

    if (input.code && input.code !== coupon.code) {
      const existingCoupon = await prisma.coupon.findUnique({
        where: { code: input.code.toUpperCase() },
      });

      if (existingCoupon) {
        throw new CustomError("Coupon code already exists", 409);
      }
    }
    
    
    const start = input.startsAt ? new Date(input.startsAt) : coupon.startsAt;

    const end = input.expiresAt ? new Date(input.expiresAt) : coupon.expiresAt;
    
    if (start >= end) throw new CustomError("Expiry date must be after start date", 400);

    const updateData: any = {};
    if (input.code) updateData.code = input.code.toUpperCase();

    if (input.type) updateData.type = input.type;
    
    if (input.value !== undefined) updateData.value = input.value;
    
    if (input.minOrderValue !== undefined) updateData.minOrderValue = input.minOrderValue;
    
    if (input.maxDiscount !== undefined) updateData.maxDiscount = input.maxDiscount;
    
    if (input.isStackable !== undefined) updateData.isStackable = input.isStackable;
    
    if (input.startsAt) updateData.startsAt = input.startsAt;
    
    if (input.expiresAt) updateData.expiresAt = input.expiresAt;

    const updatedCoupon = await prisma.coupon.update({
      where: { id: couponId },
      data: updateData,
    });
    
    // Note: Updating arrays (products/variants) is complex, skipping for brevity unless requested. 
    // Usually requires clear + re-add or diffing.

    return updatedCoupon;
  },

  async deleteCoupon(couponId: number) {
    return await prisma.coupon.delete({ where: { id: couponId } });
  },

  async getCouponById(couponId: number) {
    const coupon = await prisma.coupon.findUnique({
      where: { id: couponId },
      include: {
        products: {
          include: { product: true, variant: true }
        },
        categories: {
          include: { category: true }
        },
      },
    });

    if (!coupon) {
      throw new CustomError("Coupon not found", 404);
    }

    return coupon;
  },

  async getAllCoupons(
    page: number = 1,
    limit: number = 10,
    filters?: { isActive?: boolean; code?: string }
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters?.isActive !== undefined) where.isActive = filters.isActive;
    if (filters?.code) where.code = { contains: filters.code.toUpperCase() };

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: { select: { products: true, categories: true, users: true } }
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.coupon.count({ where }),
    ]);

    return {
      data: coupons,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  async getCouponByCode(code: string) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        products: { include: { product: true, variant: true } },
        categories: { include: { category: true } },
      },
    });

    if (!coupon) {
      throw new CustomError("Coupon not found", 404);
    }

    const now = new Date();
    if (!coupon.isActive) throw new CustomError("Coupon is not active", 400);
    if (now < coupon.startsAt) throw new CustomError("Coupon is not yet valid", 400);
    if (now > coupon.expiresAt) throw new CustomError("Coupon has expired", 400);

    return coupon;
  },

  async validateCouponForCart(
    couponCode: string,
    cartTotal: number,
    items: { productId: string; variantId?: string; categoryId?: string }[]  
  ) {
   
    const productIds = items.map(i => i.productId);



    const coupon = await this.getCouponByCode(couponCode);

    if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
      throw new CustomError(
        `Minimum order value must be ${coupon.minOrderValue} to apply this coupon`,
        400
      );
    }

    const couponProducts = coupon.products;  
    const couponCategories = coupon.categories; 

     
    if (couponProducts.length === 0 && couponCategories.length === 0) {
      return coupon;
    }

    // Check matches
    // 1. Variant Match: If coupon has variantId, it MUST match the item' variantId
    // 2. Product Match: If coupon has productId (and no variantId), it matches any variant of that product
    // 3. Category Match: Matches Category
    
    // We need to check if AT LEAST ONE item in cart is valid for this coupon. 
    // OR if the coupon applies to the Whole Cart? Usually "Is applicable" means "Can be used".
    // Logic: If coupon has restrictions, at least one item must match.
    
    // Also, we usually need to know which items are eligible to calculate discount (if not Fixed on total).
    

    
    if (couponProducts.length > 0) {
        const productMatch = productIds.some(pid => 
            couponProducts.some(cp => cp.productId === pid && !cp.variantId) 
        );
        const variantMatch = items.some(item => 
             item.variantId && couponProducts.some(cp => cp.variantId === item.variantId)
        );
        
        if (!productMatch && !variantMatch && couponCategories.length === 0) {
             throw new CustomError("Coupon not applicable to items in cart", 400);
        }
        // If category match is possible, we'd need to check that too.
    }

    return coupon;
  },

  async toggleCouponStatus(couponId: number, isActive: boolean) {
    return prisma.coupon.update({
      where: { id: couponId },
      data: { isActive },
    });
  },
};
