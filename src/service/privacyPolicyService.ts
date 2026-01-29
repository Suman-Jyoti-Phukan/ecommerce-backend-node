import { prisma } from "../db/prisma";

class PrivacyPolicyService {
  // Get all privacy policies
  async getAllPolicies() {
    return await (prisma as any).privacypolicy.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  // Get active privacy policy
  async getActivePolicy() {
    return await (prisma as any).privacypolicy.findFirst({
      where: { isActive: true },
    });
  }

  // Get policy by ID
  async getPolicyById(id: string) {
    return await (prisma as any).privacypolicy.findUnique({
      where: { id },
    });
  }

  // Create new policy
  async createPolicy(data: {
    title: string;
    content: any;
    isActive?: boolean;
  }) {
    return await (prisma as any).privacypolicy.create({
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
    return await (prisma as any).privacypolicy.update({
      where: { id },
      data,
    });
  }

  // Delete policy
  async deletePolicy(id: string) {
    return await (prisma as any).privacypolicy.delete({
      where: { id },
    });
  }

  // Toggle active status
  async toggleStatus(id: string) {
    const policy = await (prisma as any).privacypolicy.findUnique({
      where: { id },
    });

    if (!policy) {
      throw new Error("Policy not found");
    }

    return await (prisma as any).privacypolicy.update({
      where: { id },
      data: { isActive: !policy.isActive },
    });
  }
}

export default new PrivacyPolicyService();
