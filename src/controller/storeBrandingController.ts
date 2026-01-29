import { Request, Response } from "express";

import { asyncHandler } from "../lib/asyncHandler";

import storeBrandingService from "../service/storeBrandingService";

// User endpoints
export const getActiveStoreBranding = asyncHandler(
  async (_req: Request, res: Response) => {
    const branding = await storeBrandingService.getActiveBranding();

    if (!branding) {
      res
        .status(404)
        .json({ message: "No active store branding configuration found" });
      return;
    }

    res.status(200).json({ data: branding });
  },
);

// Admin endpoints
export const getAllStoreBranding = asyncHandler(
  async (_req: Request, res: Response) => {
    const branding = await storeBrandingService.getAllBranding();
    res.status(200).json({ data: branding });
  },
);

export const createStoreBranding = asyncHandler(
  async (req: Request, res: Response) => {
    const { displayName, isActive } = req.body;

    const branding = await storeBrandingService.createBranding({
      displayName,
      isActive,
    });

    res.status(201).json({
      message: "Store branding created successfully",
      data: branding,
    });
  },
);

export const updateStoreBranding = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { displayName, isActive } = req.body;

    const branding = await storeBrandingService.updateBranding(id, {
      displayName,
      isActive,
    });

    res.status(200).json({
      message: "Store branding updated successfully",
      data: branding,
    });
  },
);

export const uploadStoreLogo = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!req.file) {
      res.status(400).json({ message: "No file provided" });
      return;
    }

    const logoPath = `/uploads/branding/logos/${req.file.filename}`;

    const branding = await storeBrandingService.uploadLogo(id, logoPath);

    res.status(200).json({
      message: "Logo uploaded successfully",
      data: branding,
    });
  },
);

export const uploadStoreBanners = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      res.status(400).json({ message: "No files provided" });
      return;
    }

    const files = Array.isArray(req.files)
      ? req.files
      : Object.values(req.files).flat();
    const bannerPaths = files.map(
      (file) => `/uploads/branding/banners/${file.filename}`,
    );

    const branding = await storeBrandingService.uploadBanners(id, bannerPaths);

    res.status(200).json({
      message: "Banners uploaded successfully",
      data: branding,
    });
    return;
  },
);

export const deleteStoreBanner = asyncHandler(
  async (req: Request, res: Response) => {
    const { id, index } = req.params;
    const bannerIndex = parseInt(index);

    const branding = await storeBrandingService.deleteBanner(id, bannerIndex);

    res.status(200).json({
      message: "Banner deleted successfully",
      data: branding,
    });
  },
);

export const deleteStoreBranding = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    await storeBrandingService.deleteBranding(id);

    res.status(200).json({ message: "Store branding deleted successfully" });
  },
);

export const toggleStoreBrandingStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const branding = await storeBrandingService.toggleStatus(id);

    res.status(200).json({
      message: "Store branding status toggled successfully",
      data: branding,
    });
  },
);
