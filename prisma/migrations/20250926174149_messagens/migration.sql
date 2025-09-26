-- CreateTable
CREATE TABLE `mensagens` (
    `id` VARCHAR(191) NOT NULL,
    `nome` TEXT NOT NULL,
    `email` TEXT NOT NULL,
    `telefone` TEXT NOT NULL,
    `endereco` TEXT NOT NULL,
    `titulo` TEXT NOT NULL,
    `descricao` TEXT NOT NULL,
    `conteudo` TEXT NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Não Lida',
    `oculta` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_mensagem` (
    `id` VARCHAR(191) NOT NULL,
    `mensagemId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `acao` TEXT NOT NULL,
    `valorAnterior` TEXT NULL,
    `valorNovo` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `log_mensagem` ADD CONSTRAINT `log_mensagem_mensagemId_fkey` FOREIGN KEY (`mensagemId`) REFERENCES `mensagens`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log_mensagem` ADD CONSTRAINT `log_mensagem_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
