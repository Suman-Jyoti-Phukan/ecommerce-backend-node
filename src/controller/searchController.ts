import { Request, Response } from "express";

import * as searchService from "../service/searchService";

import { asyncHandler } from "../lib/asyncHandler";

import { CustomError } from "../middleware/errorHandler";

export const searchCategoriesAndProducts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q || typeof q !== "string") {
      throw new CustomError("Search query parameter 'q' is required", 400);
    }

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.max(
      1,
      Math.min(100, parseInt(limit as string) || 10),
    );

    const result = await searchService.searchCategoriesAndProducts(
      q,
      pageNum,
      limitNum,
    );

    res.status(200).json({
      success: true,
      message: "Search completed successfully",
      data: result,
    });
  },
);
