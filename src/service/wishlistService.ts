import { prisma } from "../db/prisma";

interface AddToWishlistInput {
  userId: string;
  productId: string;
  variantId?: string;
}

export class WishlistService {
  async addToWishlist(input: AddToWishlistInput) {
    const { userId, productId, variantId } = input;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }
    
    if (variantId) {
        const variant = await prisma.productVariant.findUnique({
            where: { id: variantId }
        });
        if (!variant || variant.productId !== productId) throw new Error("Invalid variant");
    }

    const existingWishlist = await prisma.wishlist.findFirst({
      where: { 
          userId, 
          productId, 
          variantId: variantId || null 
      },
    });

    if (existingWishlist) {
      throw new Error("Product/Variant already in wishlist");
    }

    return await prisma.wishlist.create({
      data: {
        userId,
        productId,
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

  async removeFromWishlist(userId: string, productId: string, variantId?: string) {
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

  async isProductInWishlist(userId: string, productId: string, variantId?: string) {
    const wishlist = await prisma.wishlist.findFirst({
      where: { userId, productId, variantId: variantId || null },
    });

    return !!wishlist;
  }
}
