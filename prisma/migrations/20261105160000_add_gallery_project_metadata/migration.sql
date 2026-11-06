ALTER TABLE `Galeria`
  ADD COLUMN `title` VARCHAR(191) NOT NULL DEFAULT '',
  ADD COLUMN `category` VARCHAR(191) NOT NULL DEFAULT '',
  ADD COLUMN `location` TEXT NULL,
  ADD COLUMN `image` TEXT NULL,
  ADD COLUMN `description` TEXT NULL,
  ADD COLUMN `userId` VARCHAR(191) NULL;

UPDATE `Galeria`
SET
  `title` = `categoria`,
  `category` = `categoria`,
  `image` = `url`,
  `location` = '',
  `description` = '';

ALTER TABLE `Galeria`
  MODIFY COLUMN `location` TEXT NOT NULL,
  MODIFY COLUMN `image` TEXT NOT NULL,
  MODIFY COLUMN `description` TEXT NOT NULL;

CREATE INDEX `Galeria_userId_fkey` ON `Galeria`(`userId`);

ALTER TABLE `Galeria`
  ADD CONSTRAINT `Galeria_userId_fkey`
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;
