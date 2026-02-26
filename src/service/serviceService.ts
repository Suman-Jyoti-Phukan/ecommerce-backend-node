import { prisma } from "../db/prisma";

class ServiceService {
  // Get all services
  async getAllServices(page: number = 1, limit: number = 10) {
    const skip = (page && limit) ? (page - 1) * limit : undefined;
  const take = limit || undefined;

    const [services, total] = await Promise.all([
      (prisma as any).service.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      (prisma as any).service.count(),
    ]);

    return { services, total, page, limit, pages: Math.ceil(total / limit) };
  }

  // Get all active services
  async getActiveServices(page: number = 1, limit: number = 10) {
    const skip = (page && limit) ? (page - 1) * limit : undefined;
  const take = limit || undefined;

    const [services, total] = await Promise.all([
      (prisma as any).service.findMany({
        where: { isActive: true },
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      (prisma as any).service.count({ where: { isActive: true } }),
    ]);

    return { services, total, page, limit, pages: Math.ceil(total / limit) };
  }

  // Get service by ID
  async getServiceById(id: string) {
    return await (prisma as any).service.findUnique({
      where: { id },
    });
  }

  // Create new service
  async createService(data: {
    title: string;
    summary: string;
    content: any;
    isActive?: boolean;
  }) {
    return await (prisma as any).service.create({
      data: {
        title: data.title,
        summary: data.summary,
        content: data.content,
        isActive: data.isActive ?? true,
      },
    });
  }

  // Update service
  async updateService(
    id: string,
    data: {
      title?: string;
      summary?: string;
      content?: any;
      isActive?: boolean;
    },
  ) {
    return await (prisma as any).service.update({
      where: { id },
      data,
    });
  }

  // Delete service
  async deleteService(id: string) {
    return await (prisma as any).service.delete({
      where: { id },
    });
  }

  // Toggle active status
  async toggleStatus(id: string) {
    const service = await (prisma as any).service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new Error("Service not found");
    }

    return await (prisma as any).service.update({
      where: { id },
      data: { isActive: !service.isActive },
    });
  }
}

export default new ServiceService();
