import { Request, Response } from "express";

import { asyncHandler } from "../lib/asyncHandler";

import disclaimerService from "../service/disclaimerService";

// User endpoints
export const getActiveDisclaimers = asyncHandler(
  async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const categoryType = req.query.categoryType as string | undefined;

    const result = await disclaimerService.getActiveDisclaimers(
      page,
      limit,
      categoryType,
    );

    res.status(200).json({ data: result });
  },
);

export const getDisclaimerById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const disclaimer = await disclaimerService.getDisclaimerById(id);

    if (!disclaimer) {
      res.status(404).json({ message: "Disclaimer not found" });
      return;
    }

    if (!disclaimer.isActive) {
      res.status(403).json({ message: "Disclaimer is not active" });
      return;
    }

    res.status(200).json({ data: disclaimer });
  },
);

// Admin endpoints
export const getAllDisclaimers = asyncHandler(
  async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const categoryType = req.query.categoryType as string | undefined;

    const result = await disclaimerService.getAllDisclaimers(
      page,
      limit,
      categoryType,
    );

    res.status(200).json({ data: result });
  },
);

export const createDisclaimer = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, categoryType, content, isActive } = req.body;

    const disclaimer = await disclaimerService.createDisclaimer({
      title,
      categoryType,
      content,
      isActive,
    });

    res.status(201).json({
      message: "Disclaimer created successfully",
      data: disclaimer,
    });
  },
);

export const updateDisclaimer = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, categoryType, content, isActive } = req.body;

    const disclaimer = await disclaimerService.updateDisclaimer(id, {
      title,
      categoryType,
      content,
      isActive,
    });

    res.status(200).json({
      message: "Disclaimer updated successfully",
      data: disclaimer,
    });
  },
);

export const deleteDisclaimer = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    await disclaimerService.deleteDisclaimer(id);

    res.status(200).json({ message: "Disclaimer deleted successfully" });
  },
);

export const toggleDisclaimerStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const disclaimer = await disclaimerService.toggleStatus(id);

    res.status(200).json({
      message: "Disclaimer status toggled successfully",
      data: disclaimer,
    });
  },
);
