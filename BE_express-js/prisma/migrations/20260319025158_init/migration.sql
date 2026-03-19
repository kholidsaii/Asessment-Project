/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Hospital` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `class` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Hospital` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `hospital` ADD COLUMN `class` VARCHAR(191) NOT NULL,
    ADD COLUMN `code` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `group` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `categories_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `questions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER NOT NULL,
    `indicator` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Hospital_code_key` ON `Hospital`(`code`);

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `questions_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
