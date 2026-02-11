import { prisma } from "../db/prisma";

class PrivacyPolicyService {

  async getAllPolicies() {
    return await (prisma as any).privacypolicy.findMany({
      orderBy: { createdAt: "desc" },
    });
  }


  async getActivePolicy() {
    return await (prisma as any).privacypolicy.findFirst({
      where: { isActive: true },
    });
  }


  async getPolicyById(id: string) {
    return await (prisma as any).privacypolicy.findUnique({
      where: { id },
    });
  }


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


  async updatePolicy(
    id: string,
    data: { title?: string; content?: any; isActive?: boolean },
  ) {
    return await (prisma as any).privacypolicy.update({
      where: { id },
      data,
    });
  }


  async deletePolicy(id: string) {
    return await (prisma as any).privacypolicy.delete({
      where: { id },
    });
  }


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
