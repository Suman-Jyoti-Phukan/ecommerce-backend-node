-- CreateTable
CREATE TABLE `shiprocketorder` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NULL,
    `orderNumber` VARCHAR(191) NULL,
    `srOrderId` INTEGER NULL,
    `channelOrderId` VARCHAR(191) NULL,
    `shipmentId` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'NEW',
    `statusCode` INTEGER NULL,
    `awbCode` VARCHAR(191) NULL,
    `courierCompanyId` VARCHAR(191) NULL,
    `courierName` VARCHAR(191) NULL,
    `requestPayload` JSON NOT NULL,
    `responsePayload` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shiprocketorder_orderNumber_key`(`orderNumber`),
    INDEX `shiprocketorder_orderId_idx`(`orderId`),
    INDEX `shiprocketorder_srOrderId_idx`(`srOrderId`),
    INDEX `shiprocketorder_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `shiprocketorder` ADD CONSTRAINT `shiprocketorder_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
