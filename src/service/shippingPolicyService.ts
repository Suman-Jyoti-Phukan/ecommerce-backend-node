import { prisma } from "../db/prisma";

class ShippingPolicyService {
  // Get all shipping policies
  async getAllPolicies(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [policies, total] = await Promise.all([
      (prisma as any).shippingpolicy.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      (prisma as any).shippingpolicy.count(),
    ]);

    return { policies, total, page, limit, pages: Math.ceil(total / limit) };
  }

  // Get all active shipping policies
  async getActivePolicies(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [policies, total] = await Promise.all([
      (prisma as any).shippingpolicy.findMany({
        where: { isActive: true },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      (prisma as any).shippingpolicy.count({ where: { isActive: true } }),
    ]);

    return { policies, total, page, limit, pages: Math.ceil(total / limit) };
  }

  // Get policy by ID
  async getPolicyById(id: string) {
    return await (prisma as any).shippingpolicy.findUnique({
      where: { id },
    });
  }

  // Create new policy
  async createPolicy(data: {
    title: string;
    content: any;
    isActive?: boolean;
  }) {
    return await (prisma as any).shippingpolicy.create({
      data: {
        title: data.title,
        content: data.content,
        isActive: data.isActive ?? true,
      },
    });
  }

  // Update policy
  async updatePolicy(
    id: string,
    data: { title?: string; content?: any; isActive?: boolean },
  ) {
    return await (prisma as any).shippingpolicy.update({
      where: { id },
      data,
    });
  }

  // Delete policy
  async deletePolicy(id: string) {
    return await (prisma as any).shippingpolicy.delete({
      where: { id },
    });
  }

  // Toggle active status
  async toggleStatus(id: string) {
    const policy = await (prisma as any).shippingpolicy.findUnique({
      where: { id },
    });

    if (!policy) {
      throw new Error("Policy not found");
    }

    return await (prisma as any).shippingpolicy.update({
      where: { id },
      data: { isActive: !policy.isActive },
    });
  }
}

export default new ShippingPolicyService();
