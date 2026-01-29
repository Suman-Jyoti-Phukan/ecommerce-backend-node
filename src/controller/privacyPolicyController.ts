import { Request, Response } from "express";

import { asyncHandler } from "../lib/asyncHandler";

import privacyPolicyService from "../service/privacyPolicyService";

// User endpoints
export const getActivePrivacyPolicy = asyncHandler(
  async (_req: Request, res: Response) => {
    const policy = await privacyPolicyService.getActivePolicy();

    if (!policy) {
      res.status(404).json({ message: "No active privacy policy found" });
      return;
    }

    res.status(200).json({ data: policy });
  },
);

// Admin endpoints
export const getAllPolicies = asyncHandler(
  async (_req: Request, res: Response) => {
    const policies = await privacyPolicyService.getAllPolicies();
    res.status(200).json({ data: policies });
  },
);

export const createPolicy = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, content, isActive } = req.body;

    const policy = await privacyPolicyService.createPolicy({
      title,
      content,
      isActive,
    });

    res.status(201).json({
      message: "Privacy policy created successfully",
      data: policy,
    });
  },
);

export const updatePolicy = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content, isActive } = req.body;

    const policy = await privacyPolicyService.updatePolicy(id, {
      title,
      content,
      isActive,
    });

    res.status(200).json({
      message: "Privacy policy updated successfully",
      data: policy,
    });
  },
);

export const deletePolicy = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    await privacyPolicyService.deletePolicy(id);

    res.status(200).json({ message: "Privacy policy deleted successfully" });
  },
);

export const togglePolicyStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const policy = await privacyPolicyService.toggleStatus(id);

    res.status(200).json({
      message: "Privacy policy status toggled successfully",
      data: policy,
    });
  },
);
