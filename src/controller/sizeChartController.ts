import { Request, Response } from "express";

import { validationResult } from "express-validator";

import { sizeChartService } from "../service/sizeChartService";

import { asyncHandler } from "../lib/asyncHandler";

export const createSizeChart = asyncHandler(
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { name, sizes, colors } = req.body;

    const sizeChart = await sizeChartService.createSizeChart({
      name,
      sizes,
      colors,
    });

    res.status(201).json({
      success: true,
      message: "Size chart created successfully",
      data: sizeChart,
    });
  }
);

export const getAllSizeCharts = asyncHandler(
  async (req: Request, res: Response) => {
    
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const sizeCharts = await sizeChartService.getAllSizeCharts(
      page,
      limit
    );

    res.status(200).json({
      success: true,
      message: "Size charts retrieved successfully",
      data: sizeCharts,
    });
  }
);

export const getSizeChartById = asyncHandler(
  async (req: Request, res: Response) => {
    const { sizeChartId } = req.params;

    const sizeChart = await sizeChartService.getSizeChartById(sizeChartId);

    if (!sizeChart) {
      res.status(404).json({
        success: false,
        message: "Size chart not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Size chart retrieved successfully",
      data: sizeChart,
    });
  }
);

export const updateSizeChart = asyncHandler(
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { sizeChartId } = req.params;
    const { name, sizes, colors } = req.body;

    const sizeChart = await sizeChartService.updateSizeChart(sizeChartId, {
      name,
      sizes,
      colors,
    });

    res.status(200).json({
      success: true,
      message: "Size chart updated successfully",
      data: sizeChart,
    });
  }
);

export const deleteSizeChart = asyncHandler(
  async (req: Request, res: Response) => {
    const { sizeChartId } = req.params;

    const sizeChart = await sizeChartService.deleteSizeChart(sizeChartId);

    res.status(200).json({
      success: true,
      message: "Size chart deleted successfully",
      data: sizeChart,
    });
  }
);
