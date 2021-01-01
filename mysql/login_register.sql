-- Database: Hotel
-- ------------------------------------------------------

--
-- Table structure for table `user`
--

SET NAMES utf8;

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
    `username` VARCHAR(15),
    `password` VARCHAR(20),
    `salt` VARCHAR(16),
    `userType` int DEFAULT '-1',
    `userSex` VARCHAR(10),
    `birthdate` VARCHAR(20),
    `email` VARCHAR(50)
);

BEGIN;
INSERT INTO `user` VALUES ('cclin', 'dfbdabfd34c2ec4010c5', '4fcfbd529b9fc81f', '2', 'boy', '2000-05-11', '181250083@smail.nju.edu.cn');
COMMIT;
