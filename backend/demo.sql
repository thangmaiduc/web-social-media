Executing (default): CREATE TABLE IF NOT EXISTS `LikePosts` (
    `id` INTEGER auto_increment,
    `postId` INTEGER,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    `UserId` INTEGER,
    UNIQUE `LikePosts_UserId_postId_unique` (`postId`, `UserId`),
    PRIMARY KEY (`id`),
    FOREIGN KEY (`postId`) REFERENCES `Posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;