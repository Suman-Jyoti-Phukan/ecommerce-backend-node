import { prisma } from "../db/prisma";

import { ReturnReason } from "../generated/prisma/client";

import { CustomError } from "../middleware/errorHandler";

export const createReturnReason = async (data: ReturnReason) => {
    try {
        const returnReason = await prisma.returnReason.create({
            data,
        });
        return returnReason;
    } catch (error) {
        throw new CustomError("Failed to create return reason", 500);
    }
}

export const getAllReturnReasons = async () => {
    try {
        const returnReasons = await prisma.returnReason.findMany();
        return returnReasons;
    } catch (error) {
        throw new CustomError("Failed to get return reasons", 500);
    }
}


export const getReturnReasonById = async (id: string) => {
    try {
        const returnReason = await prisma.returnReason.findUnique({
            where: { id },
        });
        return returnReason;
    } catch (error) {
        throw new CustomError("Failed to get return reason", 500);
    }
}

export const updateReturnReason = async (id: string, data: ReturnReason) => {
    try {
        const returnReason = await prisma.returnReason.update({
            where: { id },
            data,
        });
        return returnReason;
    } catch (error) {
        throw new CustomError("Failed to update return reason", 500);
    }
}

export const deleteReturnReason = async (id: string) => {
    try {
        const returnReason = await prisma.returnReason.delete({
            where: { id },
        });
        return returnReason;
    } catch (error) {
        throw new CustomError("Failed to delete return reason", 500);
    }
}   