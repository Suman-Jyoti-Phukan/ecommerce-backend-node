import { prisma } from "../db/prisma";

import { CustomError } from "../middleware/errorHandler";

export interface CreatePincodeData {
  name: string;
  value: string;
  isActive?: boolean;
}

export interface UpdatePincodeData {
  name?: string;
  value?: string;
  isActive?: boolean;
}

export const createPincode = async (data: CreatePincodeData) => {
  // Check if pincode value already exists
  const existingPincode = await prisma.pincode.findUnique({
    where: { value: data.value },
  });

  if (existingPincode) {
    throw new CustomError("Pincode value already exists", 409);
  }

  const pincode = await prisma.pincode.create({
    data: {
      name: data.name.trim(),
      value: data.value.trim(),
      isActive: data.isActive ?? true,
    },
  });

  return pincode;
};

export const getAllPincodes = async (
  page = 1,
  limit = 10,
  includeInactive = false
) => {
  const skip = (page - 1) * limit;

  const where = includeInactive ? {} : { isActive: true };

  const pincodes = await prisma.pincode.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.pincode.count({ where });

  return {
    pincodes,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getPincodeById = async (pincodeId: string, includeInactive = false) => {
  const where: any = { id: pincodeId };
  if (!includeInactive) {
    where.isActive = true;
  }

  const pincode = await prisma.pincode.findUnique({
    where,
    include: {
      groups: {
        include: {
          pincodeGroup: {
            select: {
              id: true,
              name: true,
              description: true,
              isActive: true,
            },
          },
        },
      },
    },
  });

  if (!pincode) {
    throw new CustomError("Pincode not found", 404);
  }

  return pincode;
};

export const getPincodeByValue = async (value: string, includeInactive = false) => {
  const where: any = { value };
  if (!includeInactive) {
    where.isActive = true;
  }

  const pincode = await prisma.pincode.findUnique({
    where,
    include: {
      groups: {
        include: {
          pincodeGroup: {
            select: {
              id: true,
              name: true,
              description: true,
              isActive: true,
            },
          },
        },
      },
    },
  });

  if (!pincode) {
    throw new CustomError("Pincode not found", 404);
  }

  return pincode;
};

export const updatePincode = async (
  pincodeId: string,
  data: UpdatePincodeData
) => {
  const pincode = await prisma.pincode.findUnique({
    where: { id: pincodeId },
  });

  if (!pincode) {
    throw new CustomError("Pincode not found", 404);
  }

  // Check if new value already exists (if value is being updated)
  if (data.value && data.value !== pincode.value) {
    const existingPincode = await prisma.pincode.findUnique({
      where: { value: data.value },
    });

    if (existingPincode) {
      throw new CustomError("Pincode value already exists", 409);
    }
  }

  const updatedPincode = await prisma.pincode.update({
    where: { id: pincodeId },
    data: {
      name: data.name?.trim(),
      value: data.value?.trim(),
      isActive: data.isActive,
    },
  });

  return updatedPincode;
};

export const softDeletePincode = async (pincodeId: string) => {
  const pincode = await prisma.pincode.findUnique({
    where: { id: pincodeId },
  });

  if (!pincode) {
    throw new CustomError("Pincode not found", 404);
  }

  const updatedPincode = await prisma.pincode.update({
    where: { id: pincodeId },
    data: { isActive: false },
  });

  return updatedPincode;
};

export const restorePincode = async (pincodeId: string) => {
  const pincode = await prisma.pincode.findUnique({
    where: { id: pincodeId },
  });

  if (!pincode) {
    throw new CustomError("Pincode not found", 404);
  }

  const updatedPincode = await prisma.pincode.update({
    where: { id: pincodeId },
    data: { isActive: true },
  });

  return updatedPincode;
};

export const deletePincode = async (pincodeId: string) => {
  const pincode = await prisma.pincode.findUnique({
    where: { id: pincodeId },
  });

  if (!pincode) {
    throw new CustomError("Pincode not found", 404);
  }

  await prisma.pincode.delete({
    where: { id: pincodeId },
  });

  return { message: "Pincode deleted successfully" };
};
