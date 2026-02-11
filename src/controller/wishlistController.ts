import { Request, Response } from "express";

import { WishlistService } from "../service/wishlistService";

import { asyncHandler } from "../lib/asyncHandler";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        [key: string]: any;
      };
    }
  }
}

const wishlistService = new WishlistService();

export const addToWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const { productId, variantId } = req.body;

    if (!productId && !variantId) {
      res.status(400).json({ message: "Product ID or Variant ID is required" });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const wishlistItem = await wishlistService.addToWishlist({
      userId,
      productId,
      variantId,
    });

    res.status(201).json({
      message: "Item added to wishlist successfully",
      data: wishlistItem,
    });
  }
);

export const getWishlistItems = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const wishlistItems = await wishlistService.getWishlistItems(userId);

    const formattedItems = wishlistItems.map((item) => {
      const isVariant = !!item.variantId;
      const displayDetails = {
        name: isVariant ? `${item.product.productName} (${item.variant?.variantName || item.variant?.size || item.variant?.color})` : item.product.productName,
        price: isVariant ? (item.variant?.sellingPrice || item.variant?.maximumRetailPrice) : (item.product.sellingPrice || item.product.maximumRetailPrice),
        image: isVariant ? (JSON.parse(item.variant?.variantImages || "[]")[0] || item.product.mainImage) : item.product.mainImage,
        size: isVariant ? item.variant?.size : item.product.size,
        color: isVariant ? item.variant?.color : null,
        sku: isVariant ? item.variant?.sku : null,
      };

      return {
        ...item,
        type: isVariant ? "VARIANT" : "SIMPLE_PRODUCT",
        displayDetails
      };
    });

    res.status(200).json({
      message: "Wishlist items retrieved successfully",
      count: formattedItems.length,
      data: formattedItems,
    });
  }
);

export const removeFromWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { productId, variantId } = req.params;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    await wishlistService.removeFromWishlist(userId, productId, variantId);

    res.status(200).json({
      message: "Item removed from wishlist successfully",
    });
  }
);

export const clearWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    await wishlistService.clearWishlist(userId);

    res.status(200).json({
      message: "Wishlist cleared successfully",
    });
  }
);

export const getWishlistCount = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const count = await wishlistService.getWishlistCount(userId);

    res.status(200).json({
      message: "Wishlist count retrieved successfully",
      data: count,
    });
  }
);

export const checkProductInWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { productId, variantId } = req.params;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const isInWishlist = await wishlistService.isProductInWishlist(
      userId,
      productId,
      variantId
    );

    res.status(200).json({
      message: "Product wishlist status retrieved successfully",
      data: {
        productId,
        isInWishlist,
      },
    });
  }
);
