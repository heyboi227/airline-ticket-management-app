-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.6.7-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
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
  UNIQUE KEY `uq_address_street_and_number` (`street_and_number`),
  KEY `fk_address_user_id` (`user_id`),
  KEY `fk_address_country_id` (`country_id`),
  CONSTRAINT `fk_address_country_id` FOREIGN KEY (`country_id`) REFERENCES `country` (`country_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_address_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table diplomski_app.address: ~1 rows (approximately)
DELETE FROM `address`;
INSERT INTO `address` (`address_id`, `street_and_number`, `zip_code`, `city`, `country_id`, `phone_number`, `user_id`, `is_active`) VALUES
	(2, 'Pere Perica 11', 11000, 'Belgrade', 153, '+381611234567', 3, 1);

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

-- Dumping data for table diplomski_app.administrator: ~1 rows (approximately)
DELETE FROM `administrator`;
INSERT INTO `administrator` (`administrator_id`, `username`, `password_hash`, `created_at`, `is_active`) VALUES
	(1, 'administrator', '$2b$10$IMzeaW3XruiyZRs1jRK9NuN4b1JknWpYMf0ADWid.EOKCdh1TYVH.', '2022-08-12 09:51:57', 1);

-- Dumping structure for table diplomski_app.aircraft
DROP TABLE IF EXISTS `aircraft`;
CREATE TABLE IF NOT EXISTS `aircraft` (
  `aircraft_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('Narrow-body','Wide-body') COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`aircraft_id`),
  UNIQUE KEY `uq_aircraft_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table diplomski_app.aircraft: ~6 rows (approximately)
DELETE FROM `aircraft`;
INSERT INTO `aircraft` (`aircraft_id`, `type`, `name`) VALUES
	(1, 'Wide-body', 'Boeing 777-300'),
	(2, 'Narrow-body', 'Airbus A319-100'),
	(3, 'Narrow-body', 'ATR 72-600'),
	(4, 'Narrow-body', 'Boeing 737-800'),
	(5, 'Wide-body', 'Boeing 747-8I'),
	(6, 'Wide-body', 'Airbus A380-800');

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

-- Dumping data for table diplomski_app.airport: ~3 rows (approximately)
DELETE FROM `airport`;
INSERT INTO `airport` (`airport_id`, `airport_code`, `name`, `city`, `country_id`) VALUES
	(1, 'BEG', 'Nikola Tesla', 'Belgrade', 153),
	(2, 'VIE', 'Vienna', 'Vienna', 10),
	(3, 'LHR', 'London Heathrow', 'London', 185);

-- Dumping structure for table diplomski_app.bag
DROP TABLE IF EXISTS `bag`;
CREATE TABLE IF NOT EXISTS `bag` (
  `bag_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`bag_id`),
  UNIQUE KEY `uq_bag_type` (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table diplomski_app.bag: ~2 rows (approximately)
DELETE FROM `bag`;
INSERT INTO `bag` (`bag_id`, `name`) VALUES
	(1, 'Cabin bag'),
	(2, 'Checked bag');

-- Dumping structure for table diplomski_app.country
DROP TABLE IF EXISTS `country`;
CREATE TABLE IF NOT EXISTS `country` (
  `country_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`country_id`),
  UNIQUE KEY `uq_country_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table diplomski_app.country: ~194 rows (approximately)
DELETE FROM `country`;
INSERT INTO `country` (`country_id`, `name`) VALUES
	(1, 'Afghanistan'),
	(2, 'Albania'),
	(3, 'Algeria'),
	(4, 'Andorra'),
	(5, 'Angola'),
	(6, 'Antigua and Barbuda'),
	(7, 'Argentina'),
	(8, 'Armenia'),
	(9, 'Australia'),
	(10, 'Austria'),
	(11, 'Azerbaijan'),
	(12, 'Bahamas'),
	(13, 'Bahrain'),
	(14, 'Bangladesh'),
	(15, 'Barbados'),
	(16, 'Belarus'),
	(17, 'Belgium'),
	(18, 'Belize'),
	(19, 'Benin'),
	(20, 'Bhutan'),
	(21, 'Bolivia'),
	(22, 'Bosnia and Herzegovina'),
	(23, 'Botswana'),
	(24, 'Brazil'),
	(25, 'Brunei'),
	(26, 'Bulgaria'),
	(27, 'Burkina Faso'),
	(28, 'Burundi'),
	(30, 'Cabo Verde'),
	(31, 'Cambodia'),
	(32, 'Cameroon'),
	(33, 'Canada'),
	(34, 'Central African Republic'),
	(35, 'Chad'),
	(36, 'Chile'),
	(37, 'China'),
	(38, 'Colombia'),
	(39, 'Comoros'),
	(40, 'Congo (Congo-Brazzaville)'),
	(41, 'Costa Rica'),
	(29, 'Côte d\'Ivoire'),
	(42, 'Croatia'),
	(43, 'Cuba'),
	(44, 'Cyprus'),
	(45, 'Czechia (Czech Republic)'),
	(46, 'Democratic Republic of the Congo'),
	(47, 'Denmark'),
	(48, 'Djibouti'),
	(49, 'Dominica'),
	(50, 'Dominican Republic'),
	(51, 'Ecuador'),
	(52, 'Egypt'),
	(53, 'El Salvador'),
	(54, 'Equatorial Guinea'),
	(55, 'Eritrea'),
	(56, 'Estonia'),
	(57, 'Ethiopia'),
	(58, 'Fiji'),
	(59, 'Finland'),
	(60, 'France'),
	(61, 'Gabon'),
	(62, 'Gambia'),
	(63, 'Georgia'),
	(64, 'Germany'),
	(65, 'Ghana'),
	(66, 'Greece'),
	(67, 'Grenada'),
	(68, 'Guatemala'),
	(69, 'Guinea'),
	(70, 'Guinea-Bissau'),
	(71, 'Guyana'),
	(72, 'Haiti'),
	(73, 'Holy See'),
	(74, 'Honduras'),
	(75, 'Hungary'),
	(76, 'Iceland'),
	(77, 'India'),
	(78, 'Indonesia'),
	(79, 'Iran'),
	(80, 'Iraq'),
	(81, 'Ireland'),
	(82, 'Israel'),
	(83, 'Italy'),
	(84, 'Jamaica'),
	(85, 'Japan'),
	(86, 'Jordan'),
	(87, 'Kazakhstan'),
	(88, 'Kenya'),
	(89, 'Kiribati'),
	(90, 'Kuwait'),
	(91, 'Kyrgyzstan'),
	(92, 'Laos'),
	(93, 'Latvia'),
	(94, 'Lebanon'),
	(95, 'Lesotho'),
	(96, 'Liberia'),
	(97, 'Libya'),
	(98, 'Liechtenstein'),
	(99, 'Lithuania'),
	(100, 'Luxembourg'),
	(101, 'Madagascar'),
	(102, 'Malawi'),
	(103, 'Malaysia'),
	(104, 'Maldives'),
	(105, 'Mali'),
	(106, 'Malta'),
	(107, 'Marshall Islands'),
	(108, 'Mauritania'),
	(109, 'Mauritius'),
	(110, 'Mexico'),
	(111, 'Micronesia'),
	(112, 'Moldova'),
	(113, 'Monaco'),
	(114, 'Mongolia'),
	(115, 'Montenegro'),
	(116, 'Morocco'),
	(117, 'Mozambique'),
	(118, 'Myanmar (formerly Burma)'),
	(119, 'Namibia'),
	(120, 'Nauru'),
	(121, 'Nepal'),
	(122, 'Netherlands'),
	(123, 'New Zealand'),
	(124, 'Nicaragua'),
	(125, 'Niger'),
	(126, 'Nigeria'),
	(127, 'North Korea'),
	(128, 'North Macedonia'),
	(129, 'Norway'),
	(130, 'Oman'),
	(131, 'Pakistan'),
	(132, 'Palau'),
	(133, 'Palestine State'),
	(134, 'Panama'),
	(135, 'Papua New Guinea'),
	(136, 'Paraguay'),
	(137, 'Peru'),
	(138, 'Philippines'),
	(139, 'Poland'),
	(140, 'Portugal'),
	(141, 'Qatar'),
	(142, 'Romania'),
	(143, 'Russia'),
	(144, 'Rwanda'),
	(145, 'Saint Kitts and Nevis'),
	(146, 'Saint Lucia'),
	(147, 'Saint Vincent and the Grenadines'),
	(148, 'Samoa'),
	(149, 'San Marino'),
	(150, 'Sao Tome and Principe'),
	(151, 'Saudi Arabia'),
	(152, 'Senegal'),
	(153, 'Serbia'),
	(154, 'Seychelles'),
	(155, 'Sierra Leone'),
	(156, 'Singapore'),
	(157, 'Slovakia'),
	(158, 'Slovenia'),
	(159, 'Solomon Islands'),
	(160, 'Somalia'),
	(161, 'South Africa'),
	(162, 'South Korea'),
	(163, 'South Sudan'),
	(164, 'Spain'),
	(165, 'Sri Lanka'),
	(166, 'Sudan'),
	(167, 'Suriname'),
	(168, 'Sweden'),
	(169, 'Switzerland'),
	(170, 'Syria'),
	(171, 'Tajikistan'),
	(172, 'Tanzania'),
	(173, 'Thailand'),
	(174, 'Timor-Leste'),
	(175, 'Togo'),
	(176, 'Tonga'),
	(177, 'Trinidad and Tobago'),
	(178, 'Tunisia'),
	(179, 'Turkey'),
	(180, 'Turkmenistan'),
	(181, 'Tuvalu'),
	(182, 'Uganda'),
	(183, 'Ukraine'),
	(184, 'United Arab Emirates'),
	(185, 'United Kingdom'),
	(186, 'United States of America'),
	(187, 'Uruguay'),
	(188, 'Uzbekistan'),
	(189, 'Vanuatu'),
	(190, 'Venezuela'),
	(191, 'Vietnam'),
	(192, 'Yemen'),
	(193, 'Zambia'),
	(194, 'Zimbabwe');

-- Dumping structure for table diplomski_app.document
DROP TABLE IF EXISTS `document`;
CREATE TABLE IF NOT EXISTS `document` (
  `document_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `country_id` int(10) unsigned NOT NULL,
  `type` enum('Passport','National ID') COLLATE utf8mb4_unicode_ci NOT NULL,
  `document_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`document_id`),
  UNIQUE KEY `uq_document_document_number` (`document_number`),
  KEY `fk_document_user_id` (`user_id`),
  KEY `fk_document_country_id` (`country_id`),
  CONSTRAINT `fk_document_country_id` FOREIGN KEY (`country_id`) REFERENCES `country` (`country_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_document_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table diplomski_app.document: ~0 rows (approximately)
DELETE FROM `document`;

-- Dumping structure for table diplomski_app.flight
DROP TABLE IF EXISTS `flight`;
CREATE TABLE IF NOT EXISTS `flight` (
  `flight_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `flight_fare_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`flight_id`),
  UNIQUE KEY `uq_flight_flight_fare_code` (`flight_fare_code`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table diplomski_app.flight: ~1 rows (approximately)
DELETE FROM `flight`;
INSERT INTO `flight` (`flight_id`, `flight_fare_code`) VALUES
	(1, 'F35920G'),
	(2, 'SSERSDY');

-- Dumping structure for table diplomski_app.flight_leg
DROP TABLE IF EXISTS `flight_leg`;
CREATE TABLE IF NOT EXISTS `flight_leg` (
  `flight_leg_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `flight_code` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `flight_id` int(10) unsigned NOT NULL,
  `origin_airport_id` int(10) unsigned NOT NULL,
  `destination_airport_id` int(10) unsigned NOT NULL,
  `departure_date_and_time` datetime NOT NULL,
  `arrival_date_and_time` datetime NOT NULL,
  `aircraft_id` int(10) unsigned NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`flight_leg_id`) USING BTREE,
  UNIQUE KEY `uq_flight_flight_code` (`flight_code`),
  KEY `fk_flight_origin_airport_id` (`origin_airport_id`) USING BTREE,
  KEY `fk_flight_destination_airport_id` (`destination_airport_id`) USING BTREE,
  KEY `fk_flight_aircraft_id` (`aircraft_id`) USING BTREE,
  KEY `fk_flight_leg_flight_id` (`flight_id`),
  CONSTRAINT `fk_flight_leg_aircraft_id` FOREIGN KEY (`aircraft_id`) REFERENCES `aircraft` (`aircraft_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_flight_leg_destination_airport_id` FOREIGN KEY (`destination_airport_id`) REFERENCES `airport` (`airport_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_flight_leg_flight_id` FOREIGN KEY (`flight_id`) REFERENCES `flight` (`flight_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_flight_leg_origin_airport_id` FOREIGN KEY (`origin_airport_id`) REFERENCES `airport` (`airport_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table diplomski_app.flight_leg: ~2 rows (approximately)
DELETE FROM `flight_leg`;
INSERT INTO `flight_leg` (`flight_leg_id`, `flight_code`, `flight_id`, `origin_airport_id`, `destination_airport_id`, `departure_date_and_time`, `arrival_date_and_time`, `aircraft_id`, `is_active`) VALUES
	(1, 'JU900', 1, 1, 3, '2022-10-22 14:30:00', '2022-10-22 16:25:00', 4, 1),
	(2, 'JU120', 2, 1, 2, '2022-10-26 16:00:00', '2022-10-26 17:15:00', 3, 1);

-- Dumping structure for table diplomski_app.flight_leg_bag
DROP TABLE IF EXISTS `flight_leg_bag`;
CREATE TABLE IF NOT EXISTS `flight_leg_bag` (
  `flight_leg_bag_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `flight_leg_id` int(10) unsigned NOT NULL,
  `bag_id` int(10) unsigned NOT NULL,
  `price` decimal(10,2) unsigned NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`flight_leg_bag_id`) USING BTREE,
  UNIQUE KEY `uq_flight_bag_id_flight_id_bag_id` (`flight_leg_id`,`bag_id`) USING BTREE,
  KEY `fk_flight_leg_bag_id` (`bag_id`) USING BTREE,
  CONSTRAINT `fk_flight_leg_bag_id` FOREIGN KEY (`bag_id`) REFERENCES `bag` (`bag_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_flight_leg_flight_leg_id` FOREIGN KEY (`flight_leg_id`) REFERENCES `flight_leg` (`flight_leg_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table diplomski_app.flight_leg_bag: ~4 rows (approximately)
DELETE FROM `flight_leg_bag`;
INSERT INTO `flight_leg_bag` (`flight_leg_bag_id`, `flight_leg_id`, `bag_id`, `price`, `is_active`) VALUES
	(1, 1, 1, 12000.00, 1),
	(2, 1, 2, 25000.00, 1),
	(3, 2, 1, 10000.00, 1),
	(4, 2, 2, 22000.00, 1);

-- Dumping structure for table diplomski_app.flight_leg_travel_class
DROP TABLE IF EXISTS `flight_leg_travel_class`;
CREATE TABLE IF NOT EXISTS `flight_leg_travel_class` (
  `flight_leg_travel_class_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `flight_leg_id` int(10) unsigned NOT NULL,
  `travel_class_id` int(10) unsigned NOT NULL,
  `price` decimal(10,2) unsigned NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`flight_leg_travel_class_id`) USING BTREE,
  UNIQUE KEY `uq_flight_leg_travel_class_flight_leg_id_travel_class_id` (`flight_leg_id`,`travel_class_id`) USING BTREE,
  KEY `fk_flight_leg_travel_class_travel_class_id` (`travel_class_id`) USING BTREE,
  CONSTRAINT `fk_flight_leg_travel_class_flight_leg_id` FOREIGN KEY (`flight_leg_id`) REFERENCES `flight_leg` (`flight_leg_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_flight_leg_travel_class_travel_class_id` FOREIGN KEY (`travel_class_id`) REFERENCES `travel_class` (`travel_class_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table diplomski_app.flight_leg_travel_class: ~4 rows (approximately)
DELETE FROM `flight_leg_travel_class`;
INSERT INTO `flight_leg_travel_class` (`flight_leg_travel_class_id`, `flight_leg_id`, `travel_class_id`, `price`, `is_active`) VALUES
	(1, 1, 4, 10000.00, 1),
	(2, 1, 2, 35000.00, 1),
	(3, 2, 4, 7000.00, 1),
	(4, 2, 2, 20000.00, 1);

-- Dumping structure for table diplomski_app.photo
DROP TABLE IF EXISTS `photo`;
CREATE TABLE IF NOT EXISTS `photo` (
  `photo_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `document_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`photo_id`),
  UNIQUE KEY `uq_photo_file_path` (`file_path`) USING HASH,
  KEY `fk_photo_document_id` (`document_id`),
  CONSTRAINT `fk_photo_document_id` FOREIGN KEY (`document_id`) REFERENCES `document` (`document_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table diplomski_app.photo: ~0 rows (approximately)
DELETE FROM `photo`;

-- Dumping structure for table diplomski_app.ticket
DROP TABLE IF EXISTS `ticket`;
CREATE TABLE IF NOT EXISTS `ticket` (
  `ticket_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ticket_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ticket_holder_name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `document_id` int(10) unsigned NOT NULL,
  `price` decimal(10,2) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `flight_id` int(10) unsigned NOT NULL,
  `seat_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`ticket_id`) USING BTREE,
  UNIQUE KEY `uq_ticket_ticket_number` (`ticket_number`),
  UNIQUE KEY `uq_ticket_flight_id_seat_number` (`flight_id`,`seat_number`),
  KEY `fk_ticket_document_id` (`document_id`) USING BTREE,
  KEY `fk_ticket_user_id` (`user_id`) USING BTREE,
  CONSTRAINT `fk_ticket_document_id` FOREIGN KEY (`document_id`) REFERENCES `document` (`document_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_ticket_flight_id` FOREIGN KEY (`flight_id`) REFERENCES `flight` (`flight_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_ticket_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table diplomski_app.ticket: ~0 rows (approximately)
DELETE FROM `ticket`;

-- Dumping structure for table diplomski_app.travel_class
DROP TABLE IF EXISTS `travel_class`;
CREATE TABLE IF NOT EXISTS `travel_class` (
  `travel_class_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`travel_class_id`) USING BTREE,
  UNIQUE KEY `uq_cabin_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table diplomski_app.travel_class: ~6 rows (approximately)
DELETE FROM `travel_class`;
INSERT INTO `travel_class` (`travel_class_id`, `name`) VALUES
	(5, 'Basic economy class'),
	(2, 'Business class'),
	(4, 'Economy class'),
	(1, 'First class'),
	(6, 'Premium business class'),
	(3, 'Premium economy class');

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

-- Dumping data for table diplomski_app.user: ~1 rows (approximately)
DELETE FROM `user`;
INSERT INTO `user` (`user_id`, `forename`, `surname`, `email`, `password_hash`, `is_active`, `created_at`, `updated_at`, `activation_code`, `password_reset_code`) VALUES
	(3, 'Milos', 'Jeknic', 'milosjeknic@hotmail.rs', '$2b$10$J1UH0xCp0x83keaLA74O..UkSrQTabxK.ccgcB/73NyaphUt29WhW', 1, '2022-08-13 09:03:58', '2022-08-13 09:21:19', NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
