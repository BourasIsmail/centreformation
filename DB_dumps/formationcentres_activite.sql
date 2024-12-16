-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: formationcentres
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activite`
--

DROP TABLE IF EXISTS `activite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activite` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `capacite_accueil` bigint NOT NULL,
  `date_ouverture` varchar(255) DEFAULT NULL,
  `date_signature_convention` varchar(255) DEFAULT NULL,
  `partenariat` varchar(255) DEFAULT NULL,
  `superficie` double NOT NULL,
  `gestion_id` bigint DEFAULT NULL,
  `responsable_id` bigint DEFAULT NULL,
  `type_id` bigint DEFAULT NULL,
  `centre_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfx58ybyw6muajg58kcev49tom` (`gestion_id`),
  KEY `FKa8i38kj5tdpsq1mlhwsxfj2mu` (`responsable_id`),
  KEY `FK8gswpeeaauno3lrp8pv4a5qb9` (`type_id`),
  KEY `FKf3504elcegw4jqpegect2adaj` (`centre_id`),
  CONSTRAINT `FK8gswpeeaauno3lrp8pv4a5qb9` FOREIGN KEY (`type_id`) REFERENCES `type_activite` (`id`),
  CONSTRAINT `FKa8i38kj5tdpsq1mlhwsxfj2mu` FOREIGN KEY (`responsable_id`) REFERENCES `personnel` (`personnel_id`),
  CONSTRAINT `FKf3504elcegw4jqpegect2adaj` FOREIGN KEY (`centre_id`) REFERENCES `centre` (`id`),
  CONSTRAINT `FKfx58ybyw6muajg58kcev49tom` FOREIGN KEY (`gestion_id`) REFERENCES `propriete_du_centre` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activite`
--

LOCK TABLES `activite` WRITE;
/*!40000 ALTER TABLE `activite` DISABLE KEYS */;
INSERT INTO `activite` VALUES (1,45,'01/01/19787','02/01/1253','aucune',57,1,2,2,9);
/*!40000 ALTER TABLE `activite` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-16 14:24:30
