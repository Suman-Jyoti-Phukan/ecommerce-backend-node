import { Request, Response } from "express";

import { returnService } from "../service/returnService";

import { asyncHandler } from "../lib/asyncHandler";

export const initiateReturn = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    try {
      const videoPath = req.file
        ? `/uploads/returns/${req.file.filename}`
        : undefined;

      const returnRecord = await returnService.createReturn(
        userId,
        req.body.orderItemId,
        req.body.reason,
        videoPath,
      );

      return res.status(201).json({
        success: true,
        message: "Return initiated successfully",
        data: {
          id: returnRecord.id,
          orderItemId: returnRecord.orderItemId,
          userId: returnRecord.userId,
          reason: returnRecord.reason,
          videoPath: returnRecord.videoPath,
          status: returnRecord.status,
          returnableUntil: returnRecord.returnableUntil,
          createdAt: returnRecord.createdAt,
        },
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to initiate return",
      });
    }
  },
);

export const getUserReturns = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const page = parseInt(req.query.page as string) || 1;

    const limit = parseInt(req.query.limit as string) || 10;

    const result = await returnService.getUserReturns(userId, page, limit);

    return res.status(200).json({
      success: true,
      message: "Returns retrieved successfully",
      data: result.data,
      pagination: result.pagination,
    });
  },
);

export const getReturnDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { returnId } = req.params;

    try {
      const return_record = await returnService.getReturnById(returnId, userId);

      return res.status(200).json({
        success: true,
        message: "Return details retrieved",
        data: return_record,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message || "Return not found",
      });
    }
  },
);

export const cancelReturn = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { returnId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    try {
      const updated = await returnService.cancelReturn(returnId, userId);

      return res.status(200).json({
        success: true,
        message: "Return cancelled successfully",
        data: updated,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to cancel return",
      });
    }
  },
);

export const getAllReturns = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string | undefined;
    const userId = req.query.userId as string | undefined;

    const filters: any = {};
    if (status) filters.status = status;
    if (userId) filters.userId = userId;

    const result = await returnService.getAllReturns(page, limit, filters);

    return res.status(200).json({
      success: true,
      message: "Returns retrieved successfully",
      data: result.data,
      pagination: result.pagination,
    });
  },
);

export const getAdminReturnDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const { returnId } = req.params;

    try {
      const return_record = await returnService.getReturnById(returnId);

      return res.status(200).json({
        success: true,
        message: "Return details retrieved",
        data: return_record,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message || "Return not found",
      });
    }
  },
);

export const approveReturn = asyncHandler(
  async (req: Request, res: Response) => {
    const { returnId } = req.params;
    const { adminComment } = req.body;

    try {
      const updated = await returnService.approveReturn(returnId, adminComment);

      return res.status(200).json({
        success: true,
        message: "Return approved successfully",
        data: {
          id: updated.id,
          status: updated.status,
          adminComment: updated.adminComment,
          approvedRejectedAt: updated.approvedRejectedAt,
        },
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to approve return",
      });
    }
  },
);

export const rejectReturn = asyncHandler(
  async (req: Request, res: Response) => {
    const { returnId } = req.params;
    const { adminComment } = req.body;

    if (!adminComment || adminComment.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: [
          {
            field: "adminComment",
            message: "Comment is required when rejecting a return",
          },
        ],
      });
    }

    try {
      const updated = await returnService.rejectReturn(returnId, adminComment);

      return res.status(200).json({
        success: true,
        message: "Return rejected successfully",
        data: {
          id: updated.id,
          status: updated.status,
          adminComment: updated.adminComment,
          approvedRejectedAt: updated.approvedRejectedAt,
        },
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to reject return",
      });
    }
  },
);

export const updateReturnStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { returnId } = req.params;

    try {
      const updated = await returnService.updateReturnStatus(
        returnId,
        req.body.status,
        req.body.comment,
      );

      return res.status(200).json({
        success: true,
        message: "Return status updated successfully",
        data: updated,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to update return status",
      });
    }
  },
);

export const setDeliveryDate = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderItemId } = req.params;
    const { deliveredAt } = req.body;

    if (!deliveredAt) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: [
          {
            field: "deliveredAt",
            message: "Delivery date is required",
          },
        ],
      });
    }

    try {
      const deliveryDate = new Date(deliveredAt);
      if (isNaN(deliveryDate.getTime())) {
        throw new Error("Invalid date format. Please use ISO 8601 format");
      }

      const updated = await returnService.setDeliveryDate(
        orderItemId,
        deliveryDate,
      );

      return res.status(200).json({
        success: true,
        message: "Delivery date set successfully",
        data: {
          id: updated.id,
          deliveredAt: updated.deliveredAt,
        },
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to set delivery date",
      });
    }
  },
);
