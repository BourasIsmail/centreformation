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
-- Table structure for table `province`
--

DROP TABLE IF EXISTS `province`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `province` (
  `province_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `region_id` bigint DEFAULT NULL,
  PRIMARY KEY (`province_id`),
  KEY `FKc7qs0yyib7q7aeqek906g81cn` (`region_id`),
  CONSTRAINT `FKc7qs0yyib7q7aeqek906g81cn` FOREIGN KEY (`region_id`) REFERENCES `region` (`region_id`)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `province`
--

LOCK TABLES `province` WRITE;
/*!40000 ALTER TABLE `province` DISABLE KEYS */;
INSERT INTO `province` VALUES (1,'Khouribga',5),(2,'Settat',6),(3,'ElJadida',6),(4,'Safi',7),(5,'Boulmane',3),(6,'Fes',3),(7,'Moulay Yacoub',3),(9,'Kénitra',4),(10,'Sidi Kacem',4),(11,'CasaAnfa',6),(12,'Mohammadia',2),(13,'Ben Msik',6),(14,'My Rachid',6),(15,'Ain Sbaa',6),(18,'Ain Chock',6),(19,'Sidi Bernoussi',6),(20,'Guelmim',10),(21,'Tantan',10),(22,'Tata',9),(23,'Assa Zag',10),(24,'EsSmara',11),(25,'Boujdour',11),(26,'Laayoune',11),(27,'Chichaoua',7),(28,'ElHaouz',7),(29,'Essaouira',7),(30,'Marrakech',7),(31,'ElHajeb',3),(32,'Errachidia',8),(33,'Ifrane',3),(34,'Khénifra',5),(35,'Meknes',3),(36,'Figuig',2),(37,'Nador',2),(38,'Oujda',2),(39,'Jerrada',2),(40,'Taourirt',2),(41,'Berkane',2),(42,'Dakhla',12),(43,'Ousserd',12),(44,'Khémisset',4),(45,'Rabat',4),(46,'Salé',4),(48,'Témara',4),(49,'Inzegane Ait Melloul',9),(50,'Chtouka Ait baha',9),(51,'Ouarzazate',8),(52,'Zagora',8),(53,'Taroudant',9),(54,'Tiznit',9),(55,'Azilal',5),(56,'Béni Mellal',5),(57,'Chefchaouen',1),(58,'Larache',1),(59,'El Fahs Anjra',1),(60,'Tétouan',1),(61,'AlHoceima',1),(62,'Taounate',3),(63,'Taza',3),(64,'Benslimane',6),(66,'Agadir',9),(67,'El Kelaa des Sraghna',7),(68,'Sefrou',3),(69,'Tanger',1),(70,'Médiouna',6),(71,'Nouacer',6),(72,'Mdiq-Fnideq',1),(73,'Hay hassani',6),(74,'Midelt',8),(76,'Tinghir',8),(77,'Youssoufia',7),(78,'Berrchid',6),(79,'Ouazzane',1),(80,'Sidi Ifni',10),(81,'Driouch',2),(82,'Tarfaya',11),(83,'Fqih Ben Saleh',5),(84,'Sidi Slimane',4),(85,'Erhamna',7),(86,'Sidi Bennour',6),(87,'Guercif',2),(88,'Mers Sultan',6);
/*!40000 ALTER TABLE `province` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-16 14:24:31
