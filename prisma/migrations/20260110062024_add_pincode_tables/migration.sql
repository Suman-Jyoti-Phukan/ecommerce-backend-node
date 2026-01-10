-- CreateTable
CREATE TABLE `Pincode` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Pincode_value_key`(`value`),
    INDEX `Pincode_value_idx`(`value`),
    INDEX `Pincode_name_idx`(`name`),
    INDEX `Pincode_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PincodeGroup` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PincodeGroup_name_idx`(`name`),
    INDEX `PincodeGroup_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PincodeGroupPincode` (
    `id` VARCHAR(191) NOT NULL,
    `pincodeGroupId` VARCHAR(191) NOT NULL,
    `pincodeId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PincodeGroupPincode_pincodeGroupId_idx`(`pincodeGroupId`),
    INDEX `PincodeGroupPincode_pincodeId_idx`(`pincodeId`),
    UNIQUE INDEX `PincodeGroupPincode_pincodeGroupId_pincodeId_key`(`pincodeGroupId`, `pincodeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PincodeGroupPincode` ADD CONSTRAINT `PincodeGroupPincode_pincodeGroupId_fkey` FOREIGN KEY (`pincodeGroupId`) REFERENCES `PincodeGroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PincodeGroupPincode` ADD CONSTRAINT `PincodeGroupPincode_pincodeId_fkey` FOREIGN KEY (`pincodeId`) REFERENCES `Pincode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
