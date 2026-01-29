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
  page = 1,
  limit = 10,
): Promise<SearchResult> => {
  if (!searchTerm || searchTerm.trim() === "") {
    throw new CustomError("Search term is required", 400);
  }

  const cleanSearchTerm = searchTerm.trim().toLowerCase();
  const skip = (page - 1) * limit;

  // Search categories
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

  // Search products
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
    take: limit,
  });

  // Get total count for pagination
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
      page,
      limit,
      total: totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
    },
  };
};
