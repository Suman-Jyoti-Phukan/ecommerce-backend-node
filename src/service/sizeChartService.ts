import { prisma } from "../db/prisma";

import { SizeChart } from "../generated/prisma/client";

interface CreateSizeChartInput {
  name: string;
  sizes: any;
  colors: any;
}

interface UpdateSizeChartInput extends Partial<CreateSizeChartInput> {}

export const sizeChartService = {
  async createSizeChart(input: CreateSizeChartInput): Promise<SizeChart> {
    return prisma.sizeChart.create({
      data: {
        ...input,
      },
    });
  },

  async getAllSizeCharts(page: number = 1, limit: number = 10) {
    const skip = (page && limit) ? (page - 1) * limit : undefined;
  const take = limit || undefined;

    return prisma.sizeChart.findMany({
      skip,
      take,
    });
  },

  async getSizeChartById(sizeChartId: string): Promise<SizeChart | null> {
    return prisma.sizeChart.findUnique({
      where: {
        id: sizeChartId,
      },
    });
  },

  async updateSizeChart(
    sizeChartId: string,
    input: UpdateSizeChartInput
  ): Promise<SizeChart> {
    return prisma.sizeChart.update({
      where: {
        id: sizeChartId,
      },
      data: {
        ...input,
      },
    });
  },

  async deleteSizeChart(sizeChartId: string): Promise<SizeChart> {
    return prisma.sizeChart.delete({
      where: {
        id: sizeChartId,
      },
    });
  },
};
