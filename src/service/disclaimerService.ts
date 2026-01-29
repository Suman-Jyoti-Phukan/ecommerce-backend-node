import { prisma } from "../db/prisma";

class DisclaimerService {
  // Get all disclaimers
  async getAllDisclaimers(
    page: number = 1,
    limit: number = 10,
    categoryType?: string,
  ) {
    const skip = (page - 1) * limit;
    const whereClause = categoryType ? { categoryType } : {};

    const [disclaimers, total] = await Promise.all([
      (prisma as any).disclaimer.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      (prisma as any).disclaimer.count({ where: whereClause }),
    ]);

    return {
      disclaimers,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  // Get all active disclaimers
  async getActiveDisclaimers(
    page: number = 1,
    limit: number = 10,
    categoryType?: string,
  ) {
    const skip = (page - 1) * limit;
    const whereClause = categoryType
      ? { isActive: true, categoryType }
      : { isActive: true };

    const [disclaimers, total] = await Promise.all([
      (prisma as any).disclaimer.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      (prisma as any).disclaimer.count({ where: whereClause }),
    ]);

    return {
      disclaimers,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  // Get disclaimer by ID
  async getDisclaimerById(id: string) {
    return await (prisma as any).disclaimer.findUnique({
      where: { id },
    });
  }

  // Create new disclaimer
  async createDisclaimer(data: {
    title: string;
    categoryType: string;
    content: any;
    isActive?: boolean;
  }) {
    return await (prisma as any).disclaimer.create({
      data: {
        title: data.title,
        categoryType: data.categoryType,
        content: data.content,
        isActive: data.isActive ?? true,
      },
    });
  }

  // Update disclaimer
  async updateDisclaimer(
    id: string,
    data: {
      title?: string;
      categoryType?: string;
      content?: any;
      isActive?: boolean;
    },
  ) {
    return await (prisma as any).disclaimer.update({
      where: { id },
      data,
    });
  }

  // Delete disclaimer
  async deleteDisclaimer(id: string) {
    return await (prisma as any).disclaimer.delete({
      where: { id },
    });
  }

  // Toggle active status
  async toggleStatus(id: string) {
    const disclaimer = await (prisma as any).disclaimer.findUnique({
      where: { id },
    });

    if (!disclaimer) {
      throw new Error("Disclaimer not found");
    }

    return await (prisma as any).disclaimer.update({
      where: { id },
      data: { isActive: !disclaimer.isActive },
    });
  }
}

export default new DisclaimerService();
