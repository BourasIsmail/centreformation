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
-- Table structure for table `personnel`
--

DROP TABLE IF EXISTS `personnel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personnel` (
  `personnel_id` bigint NOT NULL AUTO_INCREMENT,
  `diplome` varchar(255) DEFAULT NULL,
  `grade` varchar(255) DEFAULT NULL,
  `nom_complet` varchar(255) DEFAULT NULL,
  `commune_id` int DEFAULT NULL,
  `province_id` bigint DEFAULT NULL,
  PRIMARY KEY (`personnel_id`),
  KEY `FKjdmhr1bbong0g0yhr5qlj68vd` (`commune_id`),
  KEY `FKxulo928ypet9yw6c6353cgey` (`province_id`),
  CONSTRAINT `FKjdmhr1bbong0g0yhr5qlj68vd` FOREIGN KEY (`commune_id`) REFERENCES `commune` (`id`),
  CONSTRAINT `FKxulo928ypet9yw6c6353cgey` FOREIGN KEY (`province_id`) REFERENCES `province` (`province_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personnel`
--

LOCK TABLES `personnel` WRITE;
/*!40000 ALTER TABLE `personnel` DISABLE KEYS */;
INSERT INTO `personnel` VALUES (1,'Doctorat en Informatique','Professeur','Mohammed Alami',1,1),(2,'BTS en Électronique','Technicien','Fatima Zahra Bennis',2,1),(3,'Master en Génie Civil','Ingénieur','Ahmed Tazi',40,2),(4,'Licence en Gestion','Administrateur','Laila Chraibi',180,4),(5,'Master en Pédagogie','Formateur','Karim Idrissi',222,5),(6,'Master en Management de Projet','Coordinateur','Nadia Berrada',240,6),(7,'Licence en Ressources Humaines','Assistant','Youssef El Amrani',250,7),(8,'Doctorat en Sciences de l\'Environnement','Chercheur','Samira Kadiri',260,9),(9,'MBA en Administration des Affaires','Directeur','Hassan Mansouri',261,9),(10,'Master en Orientation Professionnelle','Conseiller','Amina Bouazza',300,10);
/*!40000 ALTER TABLE `personnel` ENABLE KEYS */;
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
