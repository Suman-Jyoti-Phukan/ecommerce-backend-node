-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `review_productId_fkey`;

-- AlterTable
ALTER TABLE `review` MODIFY `productId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
