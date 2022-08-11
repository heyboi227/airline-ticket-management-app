-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.6.7-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.0.0.6468
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for diplomski_app
DROP DATABASE IF EXISTS `diplomski_app`;
CREATE DATABASE IF NOT EXISTS `diplomski_app` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `diplomski_app`;

-- Dumping structure for table diplomski_app.address
DROP TABLE IF EXISTS `address`;
CREATE TABLE IF NOT EXISTS `address` (
  `address_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `street_and_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `zip_code` int(10) unsigned NOT NULL,
  `city` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country_id` int(10) unsigned NOT NULL,
  `phone_number` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`address_id`),
  UNIQUE KEY `uq_address_phone_number` (`phone_number`),
  KEY `fk_address_user_id` (`user_id`),
  KEY `fk_address_country_id` (`country_id`),
  CONSTRAINT `fk_address_country_id` FOREIGN KEY (`country_id`) REFERENCES `country` (`country_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_address_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table diplomski_app.administrator
DROP TABLE IF EXISTS `administrator`;
CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table diplomski_app.aircraft
DROP TABLE IF EXISTS `aircraft`;
CREATE TABLE IF NOT EXISTS `aircraft` (
  `aircraft_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`aircraft_id`),
  UNIQUE KEY `uq_aircraft_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table diplomski_app.airport
DROP TABLE IF EXISTS `airport`;
CREATE TABLE IF NOT EXISTS `airport` (
  `airport_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `airport_code` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`airport_id`),
  UNIQUE KEY `uq_airport_airport_code` (`airport_code`),
  KEY `fk_airport_country_id` (`country_id`),
  CONSTRAINT `fk_airport_country_id` FOREIGN KEY (`country_id`) REFERENCES `country` (`country_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table diplomski_app.bag
DROP TABLE IF EXISTS `bag`;
CREATE TABLE IF NOT EXISTS `bag` (
  `bag_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('checked bag','cabin bag') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`bag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table diplomski_app.cabin
DROP TABLE IF EXISTS `cabin`;
CREATE TABLE IF NOT EXISTS `cabin` (
  `cabin_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`cabin_id`),
  UNIQUE KEY `uq_cabin_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table diplomski_app.country
DROP TABLE IF EXISTS `country`;
CREATE TABLE IF NOT EXISTS `country` (
  `country_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`country_id`),
  UNIQUE KEY `uq_country_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table diplomski_app.document
DROP TABLE IF EXISTS `document`;
CREATE TABLE IF NOT EXISTS `document` (
  `document_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `country_id` int(10) unsigned NOT NULL,
  `type` enum('Passport','National ID') COLLATE utf8mb4_unicode_ci NOT NULL,
  `document_number` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`document_id`),
  UNIQUE KEY `uq_document_document_number` (`document_number`),
  KEY `fk_document_user_id` (`user_id`),
  KEY `fk_document_country_id` (`country_id`),
  CONSTRAINT `fk_document_country_id` FOREIGN KEY (`country_id`) REFERENCES `country` (`country_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_document_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table diplomski_app.flight
DROP TABLE IF EXISTS `flight`;
CREATE TABLE IF NOT EXISTS `flight` (
  `flight_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `flight_fare_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) unsigned NOT NULL,
  PRIMARY KEY (`flight_id`),
  UNIQUE KEY `uq_flight_flight_fare_code` (`flight_fare_code`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table diplomski_app.flight_bag
DROP TABLE IF EXISTS `flight_bag`;
CREATE TABLE IF NOT EXISTS `flight_bag` (
  `flight_bag_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `flight_id` int(10) unsigned NOT NULL,
  `bag_id` int(10) unsigned NOT NULL,
  `price` decimal(10,0) unsigned NOT NULL,
  PRIMARY KEY (`flight_bag_id`),
  UNIQUE KEY `uq_flight_bag_id_flight_id_bag_id` (`flight_id`,`bag_id`),
  KEY `fk_flight_bag_bag_bag_id` (`bag_id`),
  CONSTRAINT `fk_flight_bag_bag_bag_id` FOREIGN KEY (`bag_id`) REFERENCES `bag` (`bag_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_flight_bag_flight_flight_id` FOREIGN KEY (`flight_id`) REFERENCES `flight` (`flight_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table diplomski_app.flight_flight_leg
DROP TABLE IF EXISTS `flight_flight_leg`;
CREATE TABLE IF NOT EXISTS `flight_flight_leg` (
  `flight_flight_leg_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `flight_id` int(10) unsigned NOT NULL,
  `flight_leg_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`flight_flight_leg_id`),
  UNIQUE KEY `uq_flight_flight_leg_flight_id_flight_leg_id` (`flight_id`,`flight_leg_id`),
  KEY `fk_flight_flight_leg_flight_leg_flight_leg_id` (`flight_leg_id`),
  CONSTRAINT `fk_flight_flight_leg_flight_flight_id` FOREIGN KEY (`flight_id`) REFERENCES `flight` (`flight_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_flight_flight_leg_flight_leg_flight_leg_id` FOREIGN KEY (`flight_leg_id`) REFERENCES `flight_leg` (`flight_leg_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table diplomski_app.flight_leg
DROP TABLE IF EXISTS `flight_leg`;
CREATE TABLE IF NOT EXISTS `flight_leg` (
  `flight_leg_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `flight_code` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `origin_airport_id` int(10) unsigned NOT NULL,
  `destination_airport_id` int(10) unsigned NOT NULL,
  `departure_date_and_time` datetime NOT NULL,
  `arrival_date_and_time` datetime NOT NULL,
  `aircraft_id` int(10) unsigned NOT NULL,
  `price` decimal(10,2) unsigned NOT NULL,
  PRIMARY KEY (`flight_leg_id`) USING BTREE,
  UNIQUE KEY `uq_flight_flight_code` (`flight_code`),
  KEY `fk_flight_airport_origin_airport_id` (`origin_airport_id`),
  KEY `fk_flight_airport_destination_airport_id` (`destination_airport_id`),
  KEY `fk_flight_aircraft_aircraft_id` (`aircraft_id`),
  CONSTRAINT `fk_flight_aircraft_aircraft_id` FOREIGN KEY (`aircraft_id`) REFERENCES `aircraft` (`aircraft_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_flight_airport_destination_airport_id` FOREIGN KEY (`destination_airport_id`) REFERENCES `airport` (`airport_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_flight_airport_origin_airport_id` FOREIGN KEY (`origin_airport_id`) REFERENCES `airport` (`airport_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table diplomski_app.flight_leg_cabin
DROP TABLE IF EXISTS `flight_leg_cabin`;
CREATE TABLE IF NOT EXISTS `flight_leg_cabin` (
  `flight_leg_cabin_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `flight_leg_id` int(10) unsigned NOT NULL,
  `cabin_id` int(10) unsigned NOT NULL,
  `price` decimal(10,2) unsigned NOT NULL,
  PRIMARY KEY (`flight_leg_cabin_id`),
  UNIQUE KEY `uq_flight_leg_cabin_flight_leg_id_cabin_id` (`flight_leg_id`,`cabin_id`),
  KEY `fk_flight_leg_cabin_cabin_cabin_id` (`cabin_id`),
  CONSTRAINT `fk_flight_leg_cabin_cabin_cabin_id` FOREIGN KEY (`cabin_id`) REFERENCES `cabin` (`cabin_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_flight_leg_cabin_flight_leg_flight_leg_id` FOREIGN KEY (`flight_leg_id`) REFERENCES `flight_leg` (`flight_leg_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table diplomski_app.ticket
DROP TABLE IF EXISTS `ticket`;
CREATE TABLE IF NOT EXISTS `ticket` (
  `ticket_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ticket_number` int(10) unsigned NOT NULL,
  `ticket_holder_forename` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ticket_holder_surname` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `document_id` int(10) unsigned NOT NULL,
  `price` decimal(10,2) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `flight_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ticket_id`) USING BTREE,
  UNIQUE KEY `uq_ticket_ticket_number` (`ticket_number`),
  KEY `fk_ticket_document_ticket_holder_document_id` (`document_id`) USING BTREE,
  KEY `fk_ticket_user_user_id` (`user_id`),
  KEY `fk_ticket_flight_flight_id` (`flight_id`),
  CONSTRAINT `fk_ticket_document_document_id` FOREIGN KEY (`document_id`) REFERENCES `document` (`document_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_ticket_flight_flight_id` FOREIGN KEY (`flight_id`) REFERENCES `flight` (`flight_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_ticket_user_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table diplomski_app.user
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `forename` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `activation_code` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_reset_code` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_user_email` (`email`),
  UNIQUE KEY `uq_user_password_hash` (`password_hash`),
  UNIQUE KEY `uq_user_activation_code` (`activation_code`),
  UNIQUE KEY `uq_user_password_reset_code` (`password_reset_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
