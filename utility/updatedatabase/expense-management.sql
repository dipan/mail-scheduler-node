CREATE TABLE `user` (
  `id` varchar(255) PRIMARY KEY,
  `email` varchar(255) UNIQUE,
  `password` varchar(255),
  `role` varchar(255),
  `ct` bigint,
  `lu` bigint
);

CREATE TABLE `account` (
  `id` varchar(255) PRIMARY KEY,
  `userId` varchar(255) NOT NULL,
  `type` ENUM ('bank', 'digital_bank', 'digital_wallet', 'cash'),
  `name` varchar(255),
  `accNo` varchar(6),
  `ct` bigint,
  `lu` bigint
);

CREATE TABLE `passbook` (
  `id` varchar(255) PRIMARY KEY,
  `accountId` varchar(255) NOT NULL,
  `description` varchar(255),
  `categoryId` varchar(255) NOT NULL,
  `type` ENUM ('DEBIT','CREDIT','EARNING') NOT NULL,
  `amount` numeric,
  `ct` bigint
);

CREATE TABLE `category` (
  `id` varchar(255) PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `description` varchar(255),
  `isDeleted` boolean DEFAULT false,
  `ct` bigint
);

CREATE TABLE `tag` (
  `id` varchar(255) PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `description` varchar(255),
  `ct` bigint
);

CREATE TABLE `passbookTagRef` (
  `passbookId` varchar(255),
  `tagId` varchar(255),
  `ct` bigint
);

ALTER TABLE `account` ADD FOREIGN KEY (`userId`) REFERENCES `user` (`id`);

ALTER TABLE `passbook` ADD FOREIGN KEY (`accountId`) REFERENCES `account` (`id`);

ALTER TABLE `passbook` ADD FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`);

ALTER TABLE `passbookTagRef` ADD FOREIGN KEY (`passbookId`) REFERENCES `passbook` (`id`);

ALTER TABLE `passbookTagRef` ADD FOREIGN KEY (`tagId`) REFERENCES `tag` (`id`);

CREATE INDEX `passbook_accountid` ON `passbook` (`accountId`) USING BTREE;

CREATE UNIQUE INDEX `passbookTagRef_passbookidTagid` ON `passbookTagRef` (`passbookId`, `tagId`);
