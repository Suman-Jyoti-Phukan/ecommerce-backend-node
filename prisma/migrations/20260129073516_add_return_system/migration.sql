-- AlterTable
ALTER TABLE `orderitem` ADD COLUMN `deliveredAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `isReturn` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `productvariant` ADD COLUMN `isReturn` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `return` (
    `id` VARCHAR(191) NOT NULL,
    `orderItemId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `videoPath` VARCHAR(191) NULL,
    `status` ENUM('INITIATED', 'APPROVED', 'REJECTED', 'PROCESSING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'INITIATED',
    `approvedRejectedAt` DATETIME(3) NULL,
    `adminComment` VARCHAR(191) NULL,
    `returnableUntil` DATETIME(3) NOT NULL,
    `isReturnableWindow` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `return_orderItemId_idx`(`orderItemId`),
    INDEX `return_userId_idx`(`userId`),
    INDEX `return_status_idx`(`status`),
    INDEX `return_returnableUntil_idx`(`returnableUntil`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `returnhistory` (
    `id` VARCHAR(191) NOT NULL,
    `returnId` VARCHAR(191) NOT NULL,
    `previousStatus` ENUM('INITIATED', 'APPROVED', 'REJECTED', 'PROCESSING', 'COMPLETED', 'CANCELLED') NOT NULL,
    `newStatus` ENUM('INITIATED', 'APPROVED', 'REJECTED', 'PROCESSING', 'COMPLETED', 'CANCELLED') NOT NULL,
    `comment` VARCHAR(191) NULL,
    `changedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `returnhistory_returnId_idx`(`returnId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `return` ADD CONSTRAINT `return_orderItemId_fkey` FOREIGN KEY (`orderItemId`) REFERENCES `orderitem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `return` ADD CONSTRAINT `return_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `returnhistory` ADD CONSTRAINT `returnhistory_returnId_fkey` FOREIGN KEY (`returnId`) REFERENCES `return`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
