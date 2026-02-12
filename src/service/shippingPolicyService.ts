import { prisma } from "../db/prisma";

class ShippingPolicyService {

  async getAllPolicies(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [policies, total] = await Promise.all([
      (prisma as any).shippingPolicy.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      (prisma as any).shippingPolicy.count(),
    ]);

    return { policies, total, page, limit, pages: Math.ceil(total / limit) };
  }


  async getActivePolicies(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [policies, total] = await Promise.all([
      (prisma as any).shippingPolicy.findMany({
        where: { isActive: true },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      (prisma as any).shippingPolicy.count({ where: { isActive: true } }),
    ]);

    return { policies, total, page, limit, pages: Math.ceil(total / limit) };
  }


  async getPolicyById(id: string) {
    return await (prisma as any).shippingPolicy.findUnique({
      where: { id },
    });
  }


  async createPolicy(data: {
    title: string;
    content: any;
    isActive?: boolean;
  }) {
    return await (prisma as any).shippingPolicy.create({
      data: {
        title: data.title,
        content: data.content,
        isActive: data.isActive ?? true,
      },
    });
  }


  async updatePolicy(
    id: string,
    data: { title?: string; content?: any; isActive?: boolean },
  ) {
    return await (prisma as any).shippingPolicy.update({
      where: { id },
      data,
    });
  }


  async deletePolicy(id: string) {
    return await (prisma as any).shippingPolicy.delete({
      where: { id },
    });
  }


  async toggleStatus(id: string) {
    const policy = await (prisma as any).shippingPolicy.findUnique({
      where: { id },
    });

    if (!policy) {
      throw new Error("Policy not found");
    }

    return await (prisma as any).shippingPolicy.update({
      where: { id },
      data: { isActive: !policy.isActive },
    });
  }
}

export default new ShippingPolicyService();
