-- CreateTable
CREATE TABLE `pending_razorpay_order` (
    `id` VARCHAR(191) NOT NULL,
    `razorpayOrderId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `addressId` VARCHAR(191) NOT NULL,
    `itemsSnapshot` JSON NOT NULL,
    `couponCode` VARCHAR(191) NULL,
    `deliveryCharge` DOUBLE NOT NULL DEFAULT 0,
    `totalAmount` DOUBLE NOT NULL,
    `discountAmount` DOUBLE NOT NULL DEFAULT 0,
    `finalAmount` DOUBLE NOT NULL,
    `resolvedCouponId` INTEGER NULL,
    `orderItemsData` JSON NOT NULL,
    `isUsed` BOOLEAN NOT NULL DEFAULT false,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `pending_razorpay_order_razorpayOrderId_key`(`razorpayOrderId`),
    INDEX `pending_razorpay_order_razorpayOrderId_idx`(`razorpayOrderId`),
    INDEX `pending_razorpay_order_isUsed_idx`(`isUsed`),
    INDEX `pending_razorpay_order_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `razorpayOrderId` VARCHAR(191) NULL;
