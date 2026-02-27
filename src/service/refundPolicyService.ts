import { prisma } from "../db/prisma";

class RefundPolicyService {

    async getAllPolicies() {
        return await (prisma as any).refundPolicy.findMany({
            orderBy: { createdAt: "desc" },
        });
    }


    async getActivePolicy() {
        return await (prisma as any).refundPolicy.findFirst({
            where: { isActive: true },
        });
    }


    async getPolicyById(id: string) {
        return await (prisma as any).refundPolicy.findUnique({
            where: { id },
        });
    }


    async createPolicy(data: {
        name: string;
        content: any;
        isActive?: boolean;
    }) {
        return await (prisma as any).refundPolicy.create({
            data: {
                name: data.name,
                content: data.content,
                isActive: data.isActive ?? true,
            },
        });
    }


    async updatePolicy(
        id: string,
        data: { name?: string; content?: any; isActive?: boolean },
    ) {
        return await (prisma as any).refundPolicy.update({
            where: { id },
            data,
        });
    }


    async deletePolicy(id: string) {
        return await (prisma as any).refundPolicy.delete({
            where: { id },
        });
    }


    async toggleStatus(id: string) {
        const policy = await (prisma as any).refundPolicy.findUnique({
            where: { id },
        });

        if (!policy) {
            throw new Error("Policy not found");
        }

        return await (prisma as any).refundPolicy.update({
            where: { id },
            data: { isActive: !policy.isActive },
        });
    }
}

export default new RefundPolicyService();
