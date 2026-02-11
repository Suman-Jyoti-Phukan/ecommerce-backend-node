import { prisma } from "../db/prisma";

interface AddToWishlistInput {
  userId: string;
  productId?: string;
  variantId?: string;
}

export class WishlistService {
  async addToWishlist(input: AddToWishlistInput) {
    const { userId, productId, variantId } = input;

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

    const existingWishlist = await prisma.wishlist.findFirst({
      where: {
        userId,
        productId: finalProductId,
        variantId: variantId || null
      },
    });

    if (existingWishlist) {
      throw new Error("Product/Variant already in wishlist");
    }

    return await prisma.wishlist.create({
      data: {
        userId,
        productId: finalProductId,
        variantId: variantId || null
      },
      include: {
        product: true,
        variant: true
      },
    });
  }

  async getWishlistItems(userId: string) {
    return await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: true,
        variant: true
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async removeFromWishlist(userId: string, productId?: string, variantId?: string) {
    if (!productId && variantId) {
      const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
      if (variant) productId = variant.productId;
    }

    if (!productId) throw new Error("Product ID is required");

    const item = await prisma.wishlist.findFirst({
      where: { userId, productId, variantId: variantId || null }
    });

    if (!item) return;

    return await prisma.wishlist.delete({
      where: { id: item.id },
    });
  }

  async clearWishlist(userId: string) {
    return await prisma.wishlist.deleteMany({
      where: { userId },
    });
  }

  async getWishlistCount(userId: string) {
    return await prisma.wishlist.count({
      where: { userId },
    });
  }

  async isProductInWishlist(userId: string, productId?: string, variantId?: string) {
    if (!productId && variantId) {
      const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
      if (variant) productId = variant.productId;
    }

    if (!productId) return false;

    const wishlist = await prisma.wishlist.findFirst({
      where: { userId, productId, variantId: variantId || null },
    });

    return !!wishlist;
  }
}
