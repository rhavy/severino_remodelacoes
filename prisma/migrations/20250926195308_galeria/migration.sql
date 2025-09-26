-- CreateTable
CREATE TABLE `Galeria` (
    `id` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `categoria` TEXT NOT NULL,
    `oculta` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_galeria` (
    `id` VARCHAR(191) NOT NULL,
    `galeriaId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `acao` TEXT NOT NULL,
    `valorAnterior` TEXT NULL,
    `valorNovo` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `log_galeria` ADD CONSTRAINT `log_galeria_galeriaId_fkey` FOREIGN KEY (`galeriaId`) REFERENCES `Galeria`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log_galeria` ADD CONSTRAINT `log_galeria_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
