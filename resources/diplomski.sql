-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.11.3-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.5.0.6679
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
  `street_and_number` varchar(255) NOT NULL,
  `zip_code` int(10) unsigned NOT NULL,
  `city` varchar(128) NOT NULL,
  `country_id` int(10) unsigned NOT NULL,
  `phone_number` varchar(128) NOT NULL,
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

-- Dumping data for table diplomski_app.address: ~0 rows (approximately)
DELETE FROM `address`;
INSERT INTO `address` (`address_id`, `street_and_number`, `zip_code`, `city`, `country_id`, `phone_number`, `user_id`, `is_active`) VALUES
	(2, 'Pere Perica 11', 11000, 'Belgrade', 153, '+381611234567', 3, 1);

-- Dumping structure for table diplomski_app.administrator
DROP TABLE IF EXISTS `administrator`;
CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) NOT NULL,
  `password_hash` varchar(128) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table diplomski_app.administrator: ~1 rows (approximately)
DELETE FROM `administrator`;
INSERT INTO `administrator` (`administrator_id`, `username`, `password_hash`, `created_at`, `is_active`) VALUES
	(1, 'administrator', '$2b$10$IMzeaW3XruiyZRs1jRK9NuN4b1JknWpYMf0ADWid.EOKCdh1TYVH.', '2022-08-12 09:51:57', 1),
	(2, 'administrator-sest', '$2b$10$IQ.5.v40ZJ0Oe/mGrwD6auu9WEVLuE5fSSkaoVEbSC6P1o0F9Gw4e', '2023-06-12 18:49:54', 1);

-- Dumping structure for table diplomski_app.aircraft
DROP TABLE IF EXISTS `aircraft`;
CREATE TABLE IF NOT EXISTS `aircraft` (
  `aircraft_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `aircraft_type` enum('Narrow-body','Wide-body') NOT NULL,
  `aircraft_name` varchar(255) NOT NULL,
  PRIMARY KEY (`aircraft_id`),
  UNIQUE KEY `uq_aircraft_name` (`aircraft_name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table diplomski_app.aircraft: ~7 rows (approximately)
DELETE FROM `aircraft`;
INSERT INTO `aircraft` (`aircraft_id`, `aircraft_type`, `aircraft_name`) VALUES
	(1, 'Wide-body', 'Boeing 777-300'),
	(2, 'Narrow-body', 'Airbus A319-100'),
	(3, 'Narrow-body', 'ATR 72-600'),
	(4, 'Narrow-body', 'Boeing 737-800'),
	(5, 'Wide-body', 'Boeing 747-8I'),
	(6, 'Wide-body', 'Airbus A380-800'),
	(7, 'Narrow-body', 'Embraer E175'),
	(8, 'Narrow-body', 'Airbus A220');

-- Dumping structure for table diplomski_app.airport
DROP TABLE IF EXISTS `airport`;
CREATE TABLE IF NOT EXISTS `airport` (
  `airport_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `airport_code` varchar(3) NOT NULL,
  `airport_name` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `country_id` int(10) unsigned NOT NULL,
  `time_zone_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`airport_id`),
  UNIQUE KEY `uq_airport_airport_code` (`airport_code`),
  KEY `fk_airport_country_id` (`country_id`),
  KEY `fk_airport_time_zone_id` (`time_zone_id`),
  CONSTRAINT `fk_airport_country_id` FOREIGN KEY (`country_id`) REFERENCES `country` (`country_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_airport_time_zone_id` FOREIGN KEY (`time_zone_id`) REFERENCES `time_zone` (`time_zone_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table diplomski_app.airport: ~6 rows (approximately)
DELETE FROM `airport`;
INSERT INTO `airport` (`airport_id`, `airport_code`, `airport_name`, `city`, `country_id`, `time_zone_id`) VALUES
	(1, 'BEG', 'Nikola Tesla', 'Belgrade', 153, 277),
	(2, 'VIE', 'Vienna International', 'Vienna', 10, 307),
	(3, 'LHR', 'Heathrow', 'London', 185, 291),
	(10, 'JFK', 'John F. Kennedy International', 'New York', 186, 104),
	(11, 'BCN', 'El Prat', 'Barcelona', 164, 292),
	(12, 'TIV', 'Tivat', 'Tivat', 115, 277);

-- Dumping structure for table diplomski_app.country
DROP TABLE IF EXISTS `country`;
CREATE TABLE IF NOT EXISTS `country` (
  `country_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `country_name` varchar(128) NOT NULL,
  PRIMARY KEY (`country_id`),
  UNIQUE KEY `uq_country_name` (`country_name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table diplomski_app.country: ~194 rows (approximately)
DELETE FROM `country`;
INSERT INTO `country` (`country_id`, `country_name`) VALUES
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
  `document_type` enum('Passport','National ID') NOT NULL,
  `document_number` varchar(50) NOT NULL,
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
INSERT INTO `document` (`document_id`, `country_id`, `document_type`, `document_number`, `user_id`) VALUES
	(4, 153, 'National ID', '007430880', 3);

-- Dumping structure for table diplomski_app.flight
DROP TABLE IF EXISTS `flight`;
CREATE TABLE IF NOT EXISTS `flight` (
  `flight_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `flight_code` varchar(6) NOT NULL,
  `origin_airport_id` int(10) unsigned NOT NULL,
  `destination_airport_id` int(10) unsigned NOT NULL,
  `departure_date_and_time` datetime NOT NULL,
  `arrival_date_and_time` datetime NOT NULL,
  `aircraft_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`flight_id`) USING BTREE,
  KEY `fk_flight_origin_airport_id` (`origin_airport_id`) USING BTREE,
  KEY `fk_flight_destination_airport_id` (`destination_airport_id`) USING BTREE,
  KEY `fk_flight_aircraft_id` (`aircraft_id`) USING BTREE,
  CONSTRAINT `fk_flight_aircraft_id` FOREIGN KEY (`aircraft_id`) REFERENCES `aircraft` (`aircraft_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_flight_destination_airport_id` FOREIGN KEY (`destination_airport_id`) REFERENCES `airport` (`airport_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_flight_origin_airport_id` FOREIGN KEY (`origin_airport_id`) REFERENCES `airport` (`airport_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table diplomski_app.flight: ~11 rows (approximately)
DELETE FROM `flight`;
INSERT INTO `flight` (`flight_id`, `flight_code`, `origin_airport_id`, `destination_airport_id`, `departure_date_and_time`, `arrival_date_and_time`, `aircraft_id`) VALUES
	(1, 'AS100', 1, 3, '2023-04-01 15:00:00', '2023-04-01 18:00:00', 2),
	(2, 'AS101', 3, 1, '2023-04-01 19:10:00', '2023-04-01 21:50:00', 2),
	(6, 'AS300', 1, 10, '2023-04-05 08:30:00', '2023-04-05 18:30:00', 1),
	(7, 'AS301', 10, 1, '2023-04-05 20:45:00', '2023-04-06 05:35:00', 1),
	(12, 'AS300', 1, 10, '2023-04-25 10:00:00', '2023-04-25 20:00:00', 1),
	(13, 'AS300', 1, 10, '2023-04-27 10:00:00', '2023-04-27 20:00:00', 1),
	(14, 'AS300', 1, 10, '2023-04-29 10:00:00', '2023-04-29 20:00:00', 1),
	(15, 'AS301', 10, 1, '2023-04-25 22:00:00', '2023-04-26 06:50:00', 1),
	(16, 'AS301', 10, 1, '2023-04-27 22:00:00', '2023-04-28 06:50:00', 1),
	(17, 'AS301', 10, 1, '2023-04-29 22:00:00', '2023-04-30 06:50:00', 1),
	(19, 'JU600', 1, 11, '2023-06-14 12:15:00', '2023-06-14 14:45:00', 2);

-- Dumping structure for table diplomski_app.flight_travel_class
DROP TABLE IF EXISTS `flight_travel_class`;
CREATE TABLE IF NOT EXISTS `flight_travel_class` (
  `flight_travel_class_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `flight_id` int(10) unsigned NOT NULL,
  `travel_class_id` int(10) unsigned NOT NULL,
  `price` decimal(10,2) unsigned NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`flight_travel_class_id`) USING BTREE,
  UNIQUE KEY `uq_flight_travel_class_flight_id_travel_class_id` (`flight_id`,`travel_class_id`) USING BTREE,
  KEY `fk_flight_travel_class_travel_class_id` (`travel_class_id`) USING BTREE,
  CONSTRAINT `fk_flight_travel_class_flight_id` FOREIGN KEY (`flight_id`) REFERENCES `flight` (`flight_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_flight_travel_class_travel_class_id` FOREIGN KEY (`travel_class_id`) REFERENCES `travel_class` (`travel_class_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table diplomski_app.flight_travel_class: ~6 rows (approximately)
DELETE FROM `flight_travel_class`;
INSERT INTO `flight_travel_class` (`flight_travel_class_id`, `flight_id`, `travel_class_id`, `price`, `is_active`) VALUES
	(1, 1, 3, 11000.00, 0),
	(2, 1, 2, 32000.00, 0),
	(3, 2, 3, 11000.00, 0),
	(4, 2, 2, 32000.00, 0),
	(42, 19, 2, 5741.35, 1),
	(43, 19, 5, 8744.68, 1);

-- Dumping structure for table diplomski_app.ticket
DROP TABLE IF EXISTS `ticket`;
CREATE TABLE IF NOT EXISTS `ticket` (
  `ticket_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ticket_number` varchar(50) NOT NULL,
  `ticket_holder_name` varchar(128) NOT NULL,
  `document_id` int(10) unsigned NOT NULL,
  `price` decimal(10,2) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `flight_id` int(10) unsigned NOT NULL,
  `flight_fare_code` varchar(50) NOT NULL,
  `seat_number` varchar(50) NOT NULL,
  PRIMARY KEY (`ticket_id`) USING BTREE,
  UNIQUE KEY `uq_ticket_ticket_number` (`ticket_number`),
  UNIQUE KEY `uq_ticket_flight_id_seat_number` (`flight_id`,`seat_number`),
  UNIQUE KEY `uq_ticket_flight_fare_code` (`flight_fare_code`),
  KEY `fk_ticket_document_id` (`document_id`) USING BTREE,
  KEY `fk_ticket_user_id` (`user_id`) USING BTREE,
  CONSTRAINT `fk_ticket_document_id` FOREIGN KEY (`document_id`) REFERENCES `document` (`document_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_ticket_flight_id` FOREIGN KEY (`flight_id`) REFERENCES `flight` (`flight_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_ticket_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table diplomski_app.ticket: ~0 rows (approximately)
DELETE FROM `ticket`;
INSERT INTO `ticket` (`ticket_id`, `ticket_number`, `ticket_holder_name`, `document_id`, `price`, `user_id`, `flight_id`, `flight_fare_code`, `seat_number`) VALUES
	(1, '241242', 'Milos Jeknic', 4, 22000.00, 3, 1, '', '22F');

-- Dumping structure for table diplomski_app.time_zone
DROP TABLE IF EXISTS `time_zone`;
CREATE TABLE IF NOT EXISTS `time_zone` (
  `time_zone_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `time_zone_name` varchar(50) NOT NULL,
  PRIMARY KEY (`time_zone_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table diplomski_app.time_zone: ~351 rows (approximately)
DELETE FROM `time_zone`;
INSERT INTO `time_zone` (`time_zone_id`, `time_zone_name`) VALUES
	(1, 'Africa/Abidjan'),
	(2, 'Africa/Algiers'),
	(3, 'Africa/Bissau'),
	(4, 'Africa/Cairo'),
	(5, 'Africa/Casablanca'),
	(6, 'Africa/Ceuta'),
	(7, 'Africa/El_Aaiun'),
	(8, 'Africa/Johannesburg'),
	(9, 'Africa/Juba'),
	(10, 'Africa/Khartoum'),
	(11, 'Africa/Lagos'),
	(12, 'Africa/Maputo'),
	(13, 'Africa/Monrovia'),
	(14, 'Africa/Nairobi'),
	(15, 'Africa/Ndjamena'),
	(16, 'Africa/Sao_Tome'),
	(17, 'Africa/Tripoli'),
	(18, 'Africa/Tunis'),
	(19, 'Africa/Windhoek'),
	(20, 'America/Adak'),
	(21, 'America/Anchorage'),
	(22, 'America/Araguaina'),
	(23, 'America/Argentina/Buenos_Aires'),
	(24, 'America/Argentina/Catamarca'),
	(25, 'America/Argentina/Cordoba'),
	(26, 'America/Argentina/Jujuy'),
	(27, 'America/Argentina/La_Rioja'),
	(28, 'America/Argentina/Mendoza'),
	(29, 'America/Argentina/Rio_Gallegos'),
	(30, 'America/Argentina/Salta'),
	(31, 'America/Argentina/San_Juan'),
	(32, 'America/Argentina/San_Luis'),
	(33, 'America/Argentina/Tucuman'),
	(34, 'America/Argentina/Ushuaia'),
	(35, 'America/Asuncion'),
	(36, 'America/Bahia'),
	(37, 'America/Bahia_Banderas'),
	(38, 'America/Barbados'),
	(39, 'America/Belem'),
	(40, 'America/Belize'),
	(41, 'America/Boa_Vista'),
	(42, 'America/Bogota'),
	(43, 'America/Boise'),
	(44, 'America/Cambridge_Bay'),
	(45, 'America/Campo_Grande'),
	(46, 'America/Cancun'),
	(47, 'America/Caracas'),
	(48, 'America/Cayenne'),
	(49, 'America/Chicago'),
	(50, 'America/Chihuahua'),
	(51, 'America/Ciudad_Juarez'),
	(52, 'America/Costa_Rica'),
	(53, 'America/Cuiaba'),
	(54, 'America/Danmarkshavn'),
	(55, 'America/Dawson'),
	(56, 'America/Dawson_Creek'),
	(57, 'America/Denver'),
	(58, 'America/Detroit'),
	(59, 'America/Edmonton'),
	(60, 'America/Eirunepe'),
	(61, 'America/El_Salvador'),
	(62, 'America/Fort_Nelson'),
	(63, 'America/Fortaleza'),
	(64, 'America/Glace_Bay'),
	(65, 'America/Goose_Bay'),
	(66, 'America/Grand_Turk'),
	(67, 'America/Guatemala'),
	(68, 'America/Guayaquil'),
	(69, 'America/Guyana'),
	(70, 'America/Halifax'),
	(71, 'America/Havana'),
	(72, 'America/Hermosillo'),
	(73, 'America/Indiana/Indianapolis'),
	(74, 'America/Indiana/Knox'),
	(75, 'America/Indiana/Marengo'),
	(76, 'America/Indiana/Petersburg'),
	(77, 'America/Indiana/Tell_City'),
	(78, 'America/Indiana/Vevay'),
	(79, 'America/Indiana/Vincennes'),
	(80, 'America/Indiana/Winamac'),
	(81, 'America/Inuvik'),
	(82, 'America/Iqaluit'),
	(83, 'America/Jamaica'),
	(84, 'America/Juneau'),
	(85, 'America/Kentucky/Louisville'),
	(86, 'America/Kentucky/Monticello'),
	(87, 'America/La_Paz'),
	(88, 'America/Lima'),
	(89, 'America/Los_Angeles'),
	(90, 'America/Maceio'),
	(91, 'America/Managua'),
	(92, 'America/Manaus'),
	(93, 'America/Martinique'),
	(94, 'America/Matamoros'),
	(95, 'America/Mazatlan'),
	(96, 'America/Menominee'),
	(97, 'America/Merida'),
	(98, 'America/Metlakatla'),
	(99, 'America/Mexico_City'),
	(100, 'America/Miquelon'),
	(101, 'America/Moncton'),
	(102, 'America/Monterrey'),
	(103, 'America/Montevideo'),
	(104, 'America/New_York'),
	(105, 'America/Nome'),
	(106, 'America/Noronha'),
	(107, 'America/North_Dakota/Beulah'),
	(108, 'America/North_Dakota/Center'),
	(109, 'America/North_Dakota/New_Salem'),
	(110, 'America/Nuuk'),
	(111, 'America/Ojinaga'),
	(112, 'America/Panama'),
	(113, 'America/Paramaribo'),
	(114, 'America/Phoenix'),
	(115, 'America/Port-au-Prince'),
	(116, 'America/Porto_Velho'),
	(117, 'America/Puerto_Rico'),
	(118, 'America/Punta_Arenas'),
	(119, 'America/Rankin_Inlet'),
	(120, 'America/Recife'),
	(121, 'America/Regina'),
	(122, 'America/Resolute'),
	(123, 'America/Rio_Branco'),
	(124, 'America/Santarem'),
	(125, 'America/Santiago'),
	(126, 'America/Santo_Domingo'),
	(127, 'America/Sao_Paulo'),
	(128, 'America/Scoresbysund'),
	(129, 'America/Sitka'),
	(130, 'America/St_Johns'),
	(131, 'America/Swift_Current'),
	(132, 'America/Tegucigalpa'),
	(133, 'America/Thule'),
	(134, 'America/Tijuana'),
	(135, 'America/Toronto'),
	(136, 'America/Vancouver'),
	(137, 'America/Whitehorse'),
	(138, 'America/Winnipeg'),
	(139, 'America/Yakutat'),
	(140, 'Antarctica/Casey'),
	(141, 'Antarctica/Davis'),
	(142, 'Antarctica/Macquarie'),
	(143, 'Antarctica/Mawson'),
	(144, 'Antarctica/Palmer'),
	(145, 'Antarctica/Rothera'),
	(146, 'Antarctica/Troll'),
	(147, 'Asia/Almaty'),
	(148, 'Asia/Amman'),
	(149, 'Asia/Anadyr'),
	(150, 'Asia/Aqtau'),
	(151, 'Asia/Aqtobe'),
	(152, 'Asia/Ashgabat'),
	(153, 'Asia/Atyrau'),
	(154, 'Asia/Baghdad'),
	(155, 'Asia/Baku'),
	(156, 'Asia/Bangkok'),
	(157, 'Asia/Barnaul'),
	(158, 'Asia/Beirut'),
	(159, 'Asia/Bishkek'),
	(160, 'Asia/Chita'),
	(161, 'Asia/Choibalsan'),
	(162, 'Asia/Colombo'),
	(163, 'Asia/Damascus'),
	(164, 'Asia/Dhaka'),
	(165, 'Asia/Dili'),
	(166, 'Asia/Dubai'),
	(167, 'Asia/Dushanbe'),
	(168, 'Asia/Famagusta'),
	(169, 'Asia/Gaza'),
	(170, 'Asia/Hebron'),
	(171, 'Asia/Ho_Chi_Minh'),
	(172, 'Asia/Hong_Kong'),
	(173, 'Asia/Hovd'),
	(174, 'Asia/Irkutsk'),
	(175, 'Asia/Jakarta'),
	(176, 'Asia/Jayapura'),
	(177, 'Asia/Jerusalem'),
	(178, 'Asia/Kabul'),
	(179, 'Asia/Kamchatka'),
	(180, 'Asia/Karachi'),
	(181, 'Asia/Kathmandu'),
	(182, 'Asia/Khandyga'),
	(183, 'Asia/Kolkata'),
	(184, 'Asia/Krasnoyarsk'),
	(185, 'Asia/Kuching'),
	(186, 'Asia/Macau'),
	(187, 'Asia/Magadan'),
	(188, 'Asia/Makassar'),
	(189, 'Asia/Manila'),
	(190, 'Asia/Nicosia'),
	(191, 'Asia/Novokuznetsk'),
	(192, 'Asia/Novosibirsk'),
	(193, 'Asia/Omsk'),
	(194, 'Asia/Oral'),
	(195, 'Asia/Pontianak'),
	(196, 'Asia/Pyongyang'),
	(197, 'Asia/Qatar'),
	(198, 'Asia/Qostanay'),
	(199, 'Asia/Qyzylorda'),
	(200, 'Asia/Riyadh'),
	(201, 'Asia/Sakhalin'),
	(202, 'Asia/Samarkand'),
	(203, 'Asia/Seoul'),
	(204, 'Asia/Shanghai'),
	(205, 'Asia/Singapore'),
	(206, 'Asia/Srednekolymsk'),
	(207, 'Asia/Taipei'),
	(208, 'Asia/Tashkent'),
	(209, 'Asia/Tbilisi'),
	(210, 'Asia/Tehran'),
	(211, 'Asia/Thimphu'),
	(212, 'Asia/Tokyo'),
	(213, 'Asia/Tomsk'),
	(214, 'Asia/Ulaanbaatar'),
	(215, 'Asia/Urumqi'),
	(216, 'Asia/Ust-Nera'),
	(217, 'Asia/Vladivostok'),
	(218, 'Asia/Yakutsk'),
	(219, 'Asia/Yangon'),
	(220, 'Asia/Yekaterinburg'),
	(221, 'Asia/Yerevan'),
	(222, 'Atlantic/Azores'),
	(223, 'Atlantic/Bermuda'),
	(224, 'Atlantic/Canary'),
	(225, 'Atlantic/Cape_Verde'),
	(226, 'Atlantic/Faroe'),
	(227, 'Atlantic/Madeira'),
	(228, 'Atlantic/South_Georgia'),
	(229, 'Atlantic/Stanley'),
	(230, 'Australia/Adelaide'),
	(231, 'Australia/Brisbane'),
	(232, 'Australia/Broken_Hill'),
	(233, 'Australia/Darwin'),
	(234, 'Australia/Eucla'),
	(235, 'Australia/Hobart'),
	(236, 'Australia/Lindeman'),
	(237, 'Australia/Lord_Howe'),
	(238, 'Australia/Melbourne'),
	(239, 'Australia/Perth'),
	(240, 'Australia/Sydney'),
	(241, 'CET'),
	(242, 'CST6CDT'),
	(243, 'EET'),
	(244, 'EST'),
	(245, 'EST5EDT'),
	(246, 'Etc/GMT'),
	(247, 'Etc/GMT+1'),
	(248, 'Etc/GMT+10'),
	(249, 'Etc/GMT+11'),
	(250, 'Etc/GMT+12'),
	(251, 'Etc/GMT+2'),
	(252, 'Etc/GMT+3'),
	(253, 'Etc/GMT+4'),
	(254, 'Etc/GMT+5'),
	(255, 'Etc/GMT+6'),
	(256, 'Etc/GMT+7'),
	(257, 'Etc/GMT+8'),
	(258, 'Etc/GMT+9'),
	(259, 'Etc/GMT-1'),
	(260, 'Etc/GMT-10'),
	(261, 'Etc/GMT-11'),
	(262, 'Etc/GMT-12'),
	(263, 'Etc/GMT-13'),
	(264, 'Etc/GMT-14'),
	(265, 'Etc/GMT-2'),
	(266, 'Etc/GMT-3'),
	(267, 'Etc/GMT-4'),
	(268, 'Etc/GMT-5'),
	(269, 'Etc/GMT-6'),
	(270, 'Etc/GMT-7'),
	(271, 'Etc/GMT-8'),
	(272, 'Etc/GMT-9'),
	(273, 'Etc/UTC'),
	(274, 'Europe/Andorra'),
	(275, 'Europe/Astrakhan'),
	(276, 'Europe/Athens'),
	(277, 'Europe/Belgrade'),
	(278, 'Europe/Berlin'),
	(279, 'Europe/Brussels'),
	(280, 'Europe/Bucharest'),
	(281, 'Europe/Budapest'),
	(282, 'Europe/Chisinau'),
	(283, 'Europe/Dublin'),
	(284, 'Europe/Gibraltar'),
	(285, 'Europe/Helsinki'),
	(286, 'Europe/Istanbul'),
	(287, 'Europe/Kaliningrad'),
	(288, 'Europe/Kirov'),
	(289, 'Europe/Kyiv'),
	(290, 'Europe/Lisbon'),
	(291, 'Europe/London'),
	(292, 'Europe/Madrid'),
	(293, 'Europe/Malta'),
	(294, 'Europe/Minsk'),
	(295, 'Europe/Moscow'),
	(296, 'Europe/Paris'),
	(297, 'Europe/Prague'),
	(298, 'Europe/Riga'),
	(299, 'Europe/Rome'),
	(300, 'Europe/Samara'),
	(301, 'Europe/Saratov'),
	(302, 'Europe/Simferopol'),
	(303, 'Europe/Sofia'),
	(304, 'Europe/Tallinn'),
	(305, 'Europe/Tirane'),
	(306, 'Europe/Ulyanovsk'),
	(307, 'Europe/Vienna'),
	(308, 'Europe/Vilnius'),
	(309, 'Europe/Volgograd'),
	(310, 'Europe/Warsaw'),
	(311, 'Europe/Zurich'),
	(312, 'Factory'),
	(313, 'HST'),
	(314, 'Indian/Chagos'),
	(315, 'Indian/Maldives'),
	(316, 'Indian/Mauritius'),
	(317, 'MET'),
	(318, 'MST'),
	(319, 'MST7MDT'),
	(320, 'Pacific/Apia'),
	(321, 'Pacific/Auckland'),
	(322, 'Pacific/Bougainville'),
	(323, 'Pacific/Chatham'),
	(324, 'Pacific/Easter'),
	(325, 'Pacific/Efate'),
	(326, 'Pacific/Fakaofo'),
	(327, 'Pacific/Fiji'),
	(328, 'Pacific/Galapagos'),
	(329, 'Pacific/Gambier'),
	(330, 'Pacific/Guadalcanal'),
	(331, 'Pacific/Guam'),
	(332, 'Pacific/Honolulu'),
	(333, 'Pacific/Kanton'),
	(334, 'Pacific/Kiritimati'),
	(335, 'Pacific/Kosrae'),
	(336, 'Pacific/Kwajalein'),
	(337, 'Pacific/Marquesas'),
	(338, 'Pacific/Nauru'),
	(339, 'Pacific/Niue'),
	(340, 'Pacific/Norfolk'),
	(341, 'Pacific/Noumea'),
	(342, 'Pacific/Pago_Pago'),
	(343, 'Pacific/Palau'),
	(344, 'Pacific/Pitcairn'),
	(345, 'Pacific/Port_Moresby'),
	(346, 'Pacific/Rarotonga'),
	(347, 'Pacific/Tahiti'),
	(348, 'Pacific/Tarawa'),
	(349, 'Pacific/Tongatapu'),
	(350, 'PST8PDT'),
	(351, 'WET');

-- Dumping structure for table diplomski_app.travel_class
DROP TABLE IF EXISTS `travel_class`;
CREATE TABLE IF NOT EXISTS `travel_class` (
  `travel_class_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `travel_class_name` enum('Business','Economy') NOT NULL,
  `travel_class_subname` varchar(64) NOT NULL,
  PRIMARY KEY (`travel_class_id`) USING BTREE,
  UNIQUE KEY `uq_travel_class_subname` (`travel_class_subname`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table diplomski_app.travel_class: ~4 rows (approximately)
DELETE FROM `travel_class`;
INSERT INTO `travel_class` (`travel_class_id`, `travel_class_name`, `travel_class_subname`) VALUES
	(1, 'Economy', 'Basic Economy'),
	(2, 'Economy', 'Economy'),
	(3, 'Economy', 'Economy+'),
	(5, 'Business', 'Business');

-- Dumping structure for table diplomski_app.user
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `forename` varchar(64) NOT NULL,
  `surname` varchar(64) NOT NULL,
  `email` varchar(128) NOT NULL,
  `password_hash` varchar(128) NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `activation_code` varchar(128) DEFAULT NULL,
  `password_reset_code` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_user_email` (`email`),
  UNIQUE KEY `uq_user_password_hash` (`password_hash`),
  UNIQUE KEY `uq_user_activation_code` (`activation_code`),
  UNIQUE KEY `uq_user_password_reset_code` (`password_reset_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table diplomski_app.user: ~2 rows (approximately)
DELETE FROM `user`;
INSERT INTO `user` (`user_id`, `forename`, `surname`, `email`, `password_hash`, `is_active`, `created_at`, `updated_at`, `activation_code`, `password_reset_code`) VALUES
	(3, 'Milos', 'Jeknic', 'milosjeknic@hotmail.rs', '$2b$10$J1UH0xCp0x83keaLA74O..UkSrQTabxK.ccgcB/73NyaphUt29WhW', 1, '2022-08-13 09:03:58', '2022-08-13 09:21:19', NULL, NULL),
	(12, 'Miloš', 'Jeknić', 'milosjeknic1@gmail.com', '$2b$10$vFYyA6OzT6PdsMOnDCpS/OlqC02smtyk9eMBCJVA95FG9qEMRkzLS', 1, '2023-03-13 11:41:18', '2023-03-13 12:54:29', NULL, NULL);

-- Dumping structure for trigger diplomski_app.bi_flight
DROP TRIGGER IF EXISTS `bi_flight`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `bi_flight` BEFORE INSERT ON `flight` FOR EACH ROW BEGIN
	IF NEW.arrival_date_and_time <= NEW.departure_date_and_time THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Arrival date must be later than the departure one!';
	END IF;
	
	IF NEW.departure_date_and_time <= NOW() THEN
		SIGNAL SQLSTATE '45001' SET MESSAGE_TEXT = 'The departure date of a flight cannot be set in the past!';
	END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
