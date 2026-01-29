import { Request, Response } from "express";

import { asyncHandler } from "../lib/asyncHandler";

import serviceService from "../service/serviceService";

// User endpoints
export const getActiveServices = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await serviceService.getActiveServices(page, limit);

    res.status(200).json({ data: result });
  },
);

export const getServiceById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const service = await serviceService.getServiceById(id);

    if (!service) {
      res.status(404).json({ message: "Service not found" });
      return;
    }

    if (!service.isActive) {
      res.status(403).json({ message: "Service is not active" });
      return;
    }

    res.status(200).json({ data: service });
  },
);

// Admin endpoints
export const getAllServices = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await serviceService.getAllServices(page, limit);

    res.status(200).json({ data: result });
  },
);

export const createService = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, summary, content, isActive } = req.body;

    const service = await serviceService.createService({
      title,
      summary,
      content,
      isActive,
    });

    res.status(201).json({
      message: "Service created successfully",
      data: service,
    });
  },
);

export const updateService = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, summary, content, isActive } = req.body;

    const service = await serviceService.updateService(id, {
      title,
      summary,
      content,
      isActive,
    });

    res.status(200).json({
      message: "Service updated successfully",
      data: service,
    });
  },
);

export const deleteService = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    await serviceService.deleteService(id);

    res.status(200).json({ message: "Service deleted successfully" });
  },
);

export const toggleServiceStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const service = await serviceService.toggleStatus(id);

    res.status(200).json({
      message: "Service status toggled successfully",
      data: service,
    });
  },
);
