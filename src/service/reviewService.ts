import { prisma } from "../db/prisma";

import { CustomError } from "../middleware/errorHandler";

import { ReviewStatus, OrderStatus } from "../generated/prisma/enums";

export interface CreateReviewData {
  userId: string;
  productId?: string;
  variantId?: string;
  rating: number;
  comment?: string;
  image?: string;
}

export interface UpdateReviewStatusData {
  status: ReviewStatus;
}

export const createReview = async (data: CreateReviewData) => {
  if (!data.productId && !data.variantId) {
    throw new CustomError("Either productId or variantId must be provided", 400);
  }

  const orderItemCondition: any = {
    order: { userId: data.userId },
    status: OrderStatus.DELIVERED,
  };

  if (data.productId) {
    orderItemCondition.productId = data.productId;
  }

  if (data.variantId) {
    orderItemCondition.variantId = data.variantId;
  }

  const orderItem = await prisma.orderItem.findFirst({
    where: orderItemCondition,
    select: {
      productId: true,
      variantId: true,
    },
  });

  if (!orderItem) {

    if (process.env.NODE_ENV !== 'production') {
      const allUserOrders = await prisma.order.findMany({
        where: { userId: data.userId },
        include: { orderItems: true },
        take: 3,
      });
      console.log("Diagnostic - User Orders found:", JSON.stringify(allUserOrders, null, 2));
    }

    throw new CustomError(
      "You can only review products that have been delivered to you.",
      403,
    );
  }

  const targetProductId = orderItem.productId;
  const targetVariantId = orderItem.variantId;

  const existingReviewCondition: any = {
    userId: data.userId,
  };

  if (targetProductId) {
    existingReviewCondition.productId = targetProductId;
  } else {
    existingReviewCondition.productId = null;
  }

  if (targetVariantId) {
    existingReviewCondition.variantId = targetVariantId;
  } else {
    existingReviewCondition.variantId = null;
  }

  const existingReview = await prisma.review.findFirst({
    where: existingReviewCondition,
  });

  if (existingReview) {
    throw new CustomError("You have already reviewed this product.", 400);
  }

  const review = await prisma.review.create({
    data: {
      userId: data.userId,
      productId: targetProductId,
      variantId: targetVariantId,
      rating: data.rating,
      comment: data.comment,
      image: data.image,
      status: ReviewStatus.PENDING,
    },
    include: {
      user: {
        select: {
          fullName: true,
        },
      },
    },
  });

  return review;
};

export const getProductReviews = async (
  productId: string,
  page = 1,
  limit = 10,
) => {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: {
        productId,
        status: ReviewStatus.APPROVED,
      },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.review.count({
      where: {
        productId,
        status: ReviewStatus.APPROVED,
      },
    }),
  ]);

  return {
    reviews,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Admin Services

export const getAllReviewsForAdmin = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      skip,
      take: limit,
      include: {
        user: {
          select: {
            fullName: true,
          },
        },
        product: {
          select: {
            productName: true,
          },
        },
        variant: {
          select: {
            variantName: true,
            color: true,
            size: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.review.count(),
  ]);

  return {
    reviews,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateReviewStatus = async (
  reviewId: string,
  status: ReviewStatus,
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new CustomError("Review not found.", 404);
  }

  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: { status },
  });

  return updatedReview;
};

export const toggleReviewHighlight = async (reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new CustomError("Review not found.", 404);
  }

  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: { isHighlighted: !review.isHighlighted },
  });

  return updatedReview;
};

export const deleteReview = async (reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new CustomError("Review not found.", 404);
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });

  return { message: "Review deleted successfully" };
};
