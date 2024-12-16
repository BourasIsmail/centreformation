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
-- Table structure for table `detail_formation`
--

DROP TABLE IF EXISTS `detail_formation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detail_formation` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `activite_id` bigint DEFAULT NULL,
  `filiere_id` bigint DEFAULT NULL,
  `local_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKjj4amrpv3nfgj54uhc73uvuwv` (`activite_id`),
  KEY `FKtho5x4wn0j82rm4lh0dqulgd8` (`filiere_id`),
  KEY `FKjpyhcudsqp31qwkmtrdmbo4np` (`local_id`),
  CONSTRAINT `FKjj4amrpv3nfgj54uhc73uvuwv` FOREIGN KEY (`activite_id`) REFERENCES `activite` (`id`),
  CONSTRAINT `FKjpyhcudsqp31qwkmtrdmbo4np` FOREIGN KEY (`local_id`) REFERENCES `centre` (`id`),
  CONSTRAINT `FKtho5x4wn0j82rm4lh0dqulgd8` FOREIGN KEY (`filiere_id`) REFERENCES `filiere` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detail_formation`
--

LOCK TABLES `detail_formation` WRITE;
/*!40000 ALTER TABLE `detail_formation` DISABLE KEYS */;
/*!40000 ALTER TABLE `detail_formation` ENABLE KEYS */;
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
