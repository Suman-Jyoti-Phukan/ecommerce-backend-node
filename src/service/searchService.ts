import { prisma } from "../db/prisma";

import { CustomError } from "../middleware/errorHandler";

export interface SearchResult {
  categories: Array<{
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    slug: string | null;
  }>;
  products: Array<{
    id: string;
    productName: string;
    shortDesc: string | null;
    mainImage: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const searchCategoriesAndProducts = async (
  searchTerm: string,
  page?: number, limit?: number,
): Promise<SearchResult> => {
  if (!searchTerm || searchTerm.trim() === "") {
    throw new CustomError("Search term is required", 400);
  }

  const cleanSearchTerm = searchTerm.trim().toLowerCase();
  const skip = (page && limit) ? (page - 1) * limit : undefined;
  const take = limit || undefined;

  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
      OR: [
        {
          name: {
            contains: cleanSearchTerm,
          },
        },
        {
          description: {
            contains: cleanSearchTerm,
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      description: true,
      imageUrl: true,
      slug: true,
    },
    take: 10,
  });

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        {
          productName: {
            contains: cleanSearchTerm,
          },
        },
        {
          shortDesc: {
            contains: cleanSearchTerm,
          },
        },
        {
          longDesc: {
            contains: cleanSearchTerm,
          },
        },
      ],
    },
    select: {
      id: true,
      productName: true,
      shortDesc: true,
      mainImage: true,
    },
    skip,
    take,
  });


  const totalProducts = await prisma.product.count({
    where: {
      isActive: true,
      OR: [
        {
          productName: {
            contains: cleanSearchTerm,
          },
        },
        {
          shortDesc: {
            contains: cleanSearchTerm,
          },
        },
        {
          longDesc: {
            contains: cleanSearchTerm,
          },
        },
      ],
    },
  });

  return {
    categories,
    products,
    pagination: {
      page: page || 1,
      limit: limit || totalProducts,
      total: totalProducts,
      totalPages: limit ? Math.ceil(totalProducts / limit) : 1,
    },
  };
};
