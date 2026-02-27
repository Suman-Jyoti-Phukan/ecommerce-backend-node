import { Request, Response } from "express";

import { asyncHandler } from "../lib/asyncHandler";

import refundPolicyService from "../service/refundPolicyService";

export const getActiveRefundPolicy = asyncHandler(
    async (_req: Request, res: Response) => {
        const policy = await refundPolicyService.getActivePolicy();

        if (!policy) {
            res.status(404).json({ message: "No active refund policy found" });
            return;
        }

        res.status(200).json({ data: policy });
    },
);


export const getAllPolicies = asyncHandler(
    async (_req: Request, res: Response) => {
        const policies = await refundPolicyService.getAllPolicies();
        res.status(200).json({ data: policies });
    },
);

export const createPolicy = asyncHandler(
    async (req: Request, res: Response) => {
        const { name, content, isActive } = req.body;

        const policy = await refundPolicyService.createPolicy({
            name,
            content,
            isActive,
        });

        res.status(201).json({
            message: "Refund policy created successfully",
            data: policy,
        });
    },
);

export const updatePolicy = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name, content, isActive } = req.body;

        const policy = await refundPolicyService.updatePolicy(id, {
            name,
            content,
            isActive,
        });

        res.status(200).json({
            message: "Refund policy updated successfully",
            data: policy,
        });
    },
);

export const deletePolicy = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        await refundPolicyService.deletePolicy(id);

        res.status(200).json({ message: "Refund policy deleted successfully" });
    },
);

export const togglePolicyStatus = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const policy = await refundPolicyService.toggleStatus(id);

        res.status(200).json({
            message: "Refund policy status toggled successfully",
            data: policy,
        });
    },
);
