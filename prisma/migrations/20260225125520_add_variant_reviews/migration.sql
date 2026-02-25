-- AlterTable
ALTER TABLE `review` ADD COLUMN `variantId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `review_variantId_idx` ON `review`(`variantId`);

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `productvariant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
