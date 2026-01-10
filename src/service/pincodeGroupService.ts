import { prisma } from "../db/prisma";

import { CustomError } from "../middleware/errorHandler";

export interface CreatePincodeGroupData {
  name: string;
  description?: string;
  isActive?: boolean;
  pincodeIds?: string[];
}

export interface UpdatePincodeGroupData {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export const createPincodeGroup = async (data: CreatePincodeGroupData) => {
  // Validate pincodes if provided
  if (data.pincodeIds && data.pincodeIds.length > 0) {
    const pincodes = await prisma.pincode.findMany({
      where: {
        id: { in: data.pincodeIds },
        isActive: true,
      },
    });

    if (pincodes.length !== data.pincodeIds.length) {
      throw new CustomError("One or more pincodes not found or inactive", 404);
    }
  }

  const pincodeGroup = await prisma.pincodeGroup.create({
    data: {
      name: data.name.trim(),
      description: data.description?.trim(),
      isActive: data.isActive ?? true,
      pincodes: data.pincodeIds
        ? {
            create: data.pincodeIds.map((pincodeId) => ({
              pincodeId,
            })),
          }
        : undefined,
    },
    include: {
      pincodes: {
        include: {
          pincode: {
            select: {
              id: true,
              name: true,
              value: true,
              isActive: true,
            },
          },
        },
      },
    },
  });

  return pincodeGroup;
};

export const getAllPincodeGroups = async (
  page = 1,
  limit = 10,
  includeInactive = false
) => {
  const skip = (page - 1) * limit;

  const where = includeInactive ? {} : { isActive: true };

  const pincodeGroups = await prisma.pincodeGroup.findMany({
    where,
    skip,
    take: limit,
    include: {
      pincodes: {
        include: {
          pincode: {
            select: {
              id: true,
              name: true,
              value: true,
              isActive: true,
            },
          },
        },
      },
      _count: {
        select: {
          pincodes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.pincodeGroup.count({ where });

  return {
    pincodeGroups,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getPincodeGroupById = async (
  pincodeGroupId: string,
  includeInactive = false
) => {
  const where: any = { id: pincodeGroupId };
  if (!includeInactive) {
    where.isActive = true;
  }

  const pincodeGroup = await prisma.pincodeGroup.findUnique({
    where,
    include: {
      pincodes: {
        include: {
          pincode: {
            select: {
              id: true,
              name: true,
              value: true,
              isActive: true,
            },
          },
        },
      },
      _count: {
        select: {
          pincodes: true,
        },
      },
    },
  });

  if (!pincodeGroup) {
    throw new CustomError("Pincode group not found", 404);
  }

  return pincodeGroup;
};

export const updatePincodeGroup = async (
  pincodeGroupId: string,
  data: UpdatePincodeGroupData
) => {
  const pincodeGroup = await prisma.pincodeGroup.findUnique({
    where: { id: pincodeGroupId },
  });

  if (!pincodeGroup) {
    throw new CustomError("Pincode group not found", 404);
  }

  const updatedPincodeGroup = await prisma.pincodeGroup.update({
    where: { id: pincodeGroupId },
    data: {
      name: data.name?.trim(),
      description: data.description?.trim(),
      isActive: data.isActive,
    },
    include: {
      pincodes: {
        include: {
          pincode: {
            select: {
              id: true,
              name: true,
              value: true,
              isActive: true,
            },
          },
        },
      },
    },
  });

  return updatedPincodeGroup;
};

export const softDeletePincodeGroup = async (pincodeGroupId: string) => {
  const pincodeGroup = await prisma.pincodeGroup.findUnique({
    where: { id: pincodeGroupId },
  });

  if (!pincodeGroup) {
    throw new CustomError("Pincode group not found", 404);
  }

  const updatedPincodeGroup = await prisma.pincodeGroup.update({
    where: { id: pincodeGroupId },
    data: { isActive: false },
  });

  return updatedPincodeGroup;
};

export const restorePincodeGroup = async (pincodeGroupId: string) => {
  const pincodeGroup = await prisma.pincodeGroup.findUnique({
    where: { id: pincodeGroupId },
  });

  if (!pincodeGroup) {
    throw new CustomError("Pincode group not found", 404);
  }

  const updatedPincodeGroup = await prisma.pincodeGroup.update({
    where: { id: pincodeGroupId },
    data: { isActive: true },
  });

  return updatedPincodeGroup;
};

export const deletePincodeGroup = async (pincodeGroupId: string) => {
  const pincodeGroup = await prisma.pincodeGroup.findUnique({
    where: { id: pincodeGroupId },
  });

  if (!pincodeGroup) {
    throw new CustomError("Pincode group not found", 404);
  }

  await prisma.pincodeGroup.delete({
    where: { id: pincodeGroupId },
  });

  return { message: "Pincode group deleted successfully" };
};

export const addPincodesToGroup = async (
  pincodeGroupId: string,
  pincodeIds: string[]
) => {
  const pincodeGroup = await prisma.pincodeGroup.findUnique({
    where: { id: pincodeGroupId },
  });

  if (!pincodeGroup) {
    throw new CustomError("Pincode group not found", 404);
  }

  // Validate pincodes
  const pincodes = await prisma.pincode.findMany({
    where: {
      id: { in: pincodeIds },
      isActive: true,
    },
  });

  if (pincodes.length !== pincodeIds.length) {
    throw new CustomError("One or more pincodes not found or inactive", 404);
  }

  // Check for existing relationships
  const existingRelations = await prisma.pincodeGroupPincode.findMany({
    where: {
      pincodeGroupId,
      pincodeId: { in: pincodeIds },
    },
  });

  const existingPincodeIds = existingRelations.map((rel) => rel.pincodeId);
  const newPincodeIds = pincodeIds.filter(
    (id) => !existingPincodeIds.includes(id)
  );

  if (newPincodeIds.length === 0) {
    throw new CustomError("All pincodes are already in this group", 400);
  }

  // Create new relationships
  await prisma.pincodeGroupPincode.createMany({
    data: newPincodeIds.map((pincodeId) => ({
      pincodeGroupId,
      pincodeId,
    })),
  });

  return getPincodeGroupById(pincodeGroupId, true);
};

export const removePincodesFromGroup = async (
  pincodeGroupId: string,
  pincodeIds: string[]
) => {
  const pincodeGroup = await prisma.pincodeGroup.findUnique({
    where: { id: pincodeGroupId },
  });

  if (!pincodeGroup) {
    throw new CustomError("Pincode group not found", 404);
  }

  await prisma.pincodeGroupPincode.deleteMany({
    where: {
      pincodeGroupId,
      pincodeId: { in: pincodeIds },
    },
  });

  return getPincodeGroupById(pincodeGroupId, true);
};
