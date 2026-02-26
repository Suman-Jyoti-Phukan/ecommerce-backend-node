import { Request, Response } from "express";

import * as searchService from "../service/searchService";

import { asyncHandler } from "../lib/asyncHandler";

import { CustomError } from "../middleware/errorHandler";

export const searchCategoriesAndProducts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const q = req.query.q;
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    if (!q || typeof q !== "string") {
      throw new CustomError("Search query parameter 'q' is required", 400);
    }

    const pageNum = Math.max(1, (page as any) || 1);
    const limitNum = Math.max(
      1,
      Math.min(100, (limit as any) || 10),
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
