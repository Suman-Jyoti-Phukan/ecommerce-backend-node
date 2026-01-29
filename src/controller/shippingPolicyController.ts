import { Request, Response } from "express";

import { asyncHandler } from "../lib/asyncHandler";

import shippingPolicyService from "../service/shippingPolicyService";

// User endpoints
export const getActiveShippingPolicies = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await shippingPolicyService.getActivePolicies(page, limit);

    res.status(200).json({ data: result });
  },
);

export const getShippingPolicyById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const policy = await shippingPolicyService.getPolicyById(id);

    if (!policy) {
      res.status(404).json({ message: "Shipping policy not found" });
      return;
    }

    if (!policy.isActive) {
      res.status(403).json({ message: "Shipping policy is not active" });
      return;
    }

    res.status(200).json({ data: policy });
  },
);

// Admin endpoints
export const getAllShippingPolicies = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await shippingPolicyService.getAllPolicies(page, limit);

    res.status(200).json({ data: result });
  },
);

export const createShippingPolicy = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, content, isActive } = req.body;

    const policy = await shippingPolicyService.createPolicy({
      title,
      content,
      isActive,
    });

    res.status(201).json({
      message: "Shipping policy created successfully",
      data: policy,
    });
  },
);

export const updateShippingPolicy = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content, isActive } = req.body;

    const policy = await shippingPolicyService.updatePolicy(id, {
      title,
      content,
      isActive,
    });

    res.status(200).json({
      message: "Shipping policy updated successfully",
      data: policy,
    });
  },
);

export const deleteShippingPolicy = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    await shippingPolicyService.deletePolicy(id);

    res.status(200).json({ message: "Shipping policy deleted successfully" });
  },
);

export const toggleShippingPolicyStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const policy = await shippingPolicyService.toggleStatus(id);

    res.status(200).json({
      message: "Shipping policy status toggled successfully",
      data: policy,
    });
  },
);
