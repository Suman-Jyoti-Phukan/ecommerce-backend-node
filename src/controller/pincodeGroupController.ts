import { Request, Response } from "express";

import { AuthRequest } from "../middleware/auth";

import * as pincodeGroupService from "../service/pincodeGroupService";

export const createPincodeGroup = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const pincodeGroup = await pincodeGroupService.createPincodeGroup(req.body);

  res.status(201).json({
    success: true,
    message: "Pincode group created successfully",
    data: pincodeGroup,
  });
};

export const getAllPincodeGroups = async (
  req: Request | AuthRequest,
  res: Response
): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;

  const limit = parseInt(req.query.limit as string) || 10;

  const includeInactive = (req as AuthRequest).user
    ? req.query.includeInactive === "true"
    : false;

  const result = await pincodeGroupService.getAllPincodeGroups(
    page,
    limit,
    includeInactive
  );

  res.status(200).json({
    success: true,
    message: "Pincode groups retrieved successfully",
    data: result,
  });
};

export const getPincodeGroupById = async (
  req: Request | AuthRequest,
  res: Response
): Promise<void> => {
  const { pincodeGroupId } = req.params;

  const includeInactive = (req as AuthRequest).user
    ? req.query.includeInactive === "true"
    : false;

  const pincodeGroup = await pincodeGroupService.getPincodeGroupById(
    pincodeGroupId,
    includeInactive
  );

  res.status(200).json({
    success: true,
    message: "Pincode group retrieved successfully",
    data: pincodeGroup,
  });
};



export const updatePincodeGroup = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { pincodeGroupId } = req.params;

  const pincodeGroup = await pincodeGroupService.updatePincodeGroup(
    pincodeGroupId,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Pincode group updated successfully",
    data: pincodeGroup,
  });
};

export const softDeletePincodeGroup = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { pincodeGroupId } = req.params;

  const pincodeGroup = await pincodeGroupService.softDeletePincodeGroup(
    pincodeGroupId
  );

  res.status(200).json({
    success: true,
    message: "Pincode group soft deleted successfully",
    data: pincodeGroup,
  });
};

export const restorePincodeGroup = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { pincodeGroupId } = req.params;

  const pincodeGroup = await pincodeGroupService.restorePincodeGroup(
    pincodeGroupId
  );

  res.status(200).json({
    success: true,
    message: "Pincode group restored successfully",
    data: pincodeGroup,
  });
};

export const deletePincodeGroup = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { pincodeGroupId } = req.params;

  const result = await pincodeGroupService.deletePincodeGroup(pincodeGroupId);

  res.status(200).json({
    success: true,
    message: result.message,
  });
};

export const addPincodesToGroup = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { pincodeGroupId } = req.params;
  const { pincodeIds } = req.body;

  if (!Array.isArray(pincodeIds) || pincodeIds.length === 0) {
    res.status(400).json({
      success: false,
      message: "pincodeIds must be a non-empty array",
    });
    return;
  }

  const pincodeGroup = await pincodeGroupService.addPincodesToGroup(
    pincodeGroupId,
    pincodeIds
  );

  res.status(200).json({
    success: true,
    message: "Pincodes added to group successfully",
    data: pincodeGroup,
  });
};

export const removePincodesFromGroup = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { pincodeGroupId } = req.params;
  const { pincodeIds } = req.body;

  if (!Array.isArray(pincodeIds) || pincodeIds.length === 0) {
    res.status(400).json({
      success: false,
      message: "pincodeIds must be a non-empty array",
    });
    return;
  }

  const pincodeGroup = await pincodeGroupService.removePincodesFromGroup(
    pincodeGroupId,
    pincodeIds
  );

  res.status(200).json({
    success: true,
    message: "Pincodes removed from group successfully",
    data: pincodeGroup,
  });
};
