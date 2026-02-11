import { Router } from "express";

import {
  addToWishlist,
  getWishlistItems,
  removeFromWishlist,
  clearWishlist,
  getWishlistCount,
  checkProductInWishlist,
} from "../controller/wishlistController";

import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware as any);

router.post("/", addToWishlist);

router.get("/", getWishlistItems);

router.get("/count", getWishlistCount);

router.get("/status/:productId", checkProductInWishlist);

router.get("/status/:productId/:variantId", checkProductInWishlist);

router.delete("/:productId", removeFromWishlist);

router.delete("/:productId/:variantId", removeFromWishlist);

router.delete("/", clearWishlist);

export default router;
