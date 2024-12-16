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
-- Table structure for table `beneficiaire`
--

DROP TABLE IF EXISTS `beneficiaire`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beneficiaire` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `adresse` varchar(255) DEFAULT NULL,
  `cin` varchar(255) DEFAULT NULL,
  `date_naissance` varchar(255) DEFAULT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `prenom` varchar(255) DEFAULT NULL,
  `sexe` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `commune_id` int DEFAULT NULL,
  `province_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbdvaudn7d5bj3lkmurs8nbxai` (`commune_id`),
  KEY `FKcpxoe43sylrak9kom6rvwy3ue` (`province_id`),
  CONSTRAINT `FKbdvaudn7d5bj3lkmurs8nbxai` FOREIGN KEY (`commune_id`) REFERENCES `commune` (`id`),
  CONSTRAINT `FKcpxoe43sylrak9kom6rvwy3ue` FOREIGN KEY (`province_id`) REFERENCES `province` (`province_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beneficiaire`
--

LOCK TABLES `beneficiaire` WRITE;
/*!40000 ALTER TABLE `beneficiaire` DISABLE KEYS */;
INSERT INTO `beneficiaire` VALUES (1,'15 Rue des Orangers, Quartier Agdal','AB123456','1990-05-15','El Amrani','Fatima','F','0661234567',1,NULL),(2,'27 Avenue Hassan II','CD789012','1985-11-22','Benhaddou','Ahmed','M','0677891011',2,NULL),(3,'8 Rue Moulay Rachid, Hay Riad','EF345678','1992-03-10','Tazi','Nadia','F','0698765432',3,NULL),(4,'42 Boulevard Mohammed V','GH901234','1988-07-30','Alaoui','Karim','M','0612345678',4,NULL),(5,'3 Rue Ibn Sina, Quartier Maarif','IJ567890','1995-01-05','Bennis','Samira','F','0634567890',5,NULL),(6,'55 Avenue des FAR','KL123456','1982-09-18','Chraibi','Youssef','M','0656789012',6,NULL),(7,'12 Rue Abou Bakr Seddik, Hay Mohammadi','MN789012','1993-12-25','Lahlou','Amina','F','0678901234',7,NULL),(8,'31 Avenue Allal Ben Abdellah','OP345678','1987-06-08','Benjelloun','Hassan','M','0690123456',8,NULL),(9,'9 Rue Al Madina, Quartier Californie','QR901234','1991-04-20','Ziani','Leila','F','0623456789',9,NULL),(10,'18 Boulevard Zerktouni','ST567890','1986-08-12','Ouazzani','Mehdi','M','0645678901',10,NULL);
/*!40000 ALTER TABLE `beneficiaire` ENABLE KEYS */;
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
