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
-- Table structure for table `centre`
--

DROP TABLE IF EXISTS `centre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `centre` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `adresse` varchar(255) DEFAULT NULL,
  `cout_estimation_amenagement` double NOT NULL,
  `cout_estimation_equipement` double NOT NULL,
  `date_construction` varchar(255) DEFAULT NULL,
  `electricite` varchar(255) DEFAULT NULL,
  `etat` varchar(255) DEFAULT NULL,
  `internet` varchar(255) DEFAULT NULL,
  `nbr_imprimante` int NOT NULL,
  `nbrpc` int NOT NULL,
  `nbr_personne_connaissance_info` int NOT NULL,
  `nbr_personne_operationel_apres_formation` int NOT NULL,
  `nom_ar` varchar(255) DEFAULT NULL,
  `nom_fr` varchar(255) DEFAULT NULL,
  `observation` varchar(255) DEFAULT NULL,
  `superficie` double NOT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `telephone_fixe` varchar(255) DEFAULT NULL,
  `utilisation` varchar(255) DEFAULT NULL,
  `commune_id` int DEFAULT NULL,
  `milieu_implantation_id` bigint DEFAULT NULL,
  `province_id` bigint DEFAULT NULL,
  `responsable_id` bigint DEFAULT NULL,
  `type_centre_id` bigint DEFAULT NULL,
  `propriete_du_centre_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3wh87px2rqu74alaje679ihb8` (`commune_id`),
  KEY `FK7d058igpnc9hpgmcr3c615pq6` (`milieu_implantation_id`),
  KEY `FKi7n26ikpd12ne6p7536re9m5h` (`province_id`),
  KEY `FKlhn3c7t57hdly7gwckocrgrnr` (`responsable_id`),
  KEY `FKbyy2eufmkuiwmcqg4fp7j2nng` (`type_centre_id`),
  KEY `FKcv7tvqe6rxt47fn1phffslryc` (`propriete_du_centre_id`),
  CONSTRAINT `FK3wh87px2rqu74alaje679ihb8` FOREIGN KEY (`commune_id`) REFERENCES `commune` (`id`),
  CONSTRAINT `FK7d058igpnc9hpgmcr3c615pq6` FOREIGN KEY (`milieu_implantation_id`) REFERENCES `milieu_implantation` (`id`),
  CONSTRAINT `FKbyy2eufmkuiwmcqg4fp7j2nng` FOREIGN KEY (`type_centre_id`) REFERENCES `type_centre` (`id`),
  CONSTRAINT `FKcv7tvqe6rxt47fn1phffslryc` FOREIGN KEY (`propriete_du_centre_id`) REFERENCES `propriete_du_centre` (`id`),
  CONSTRAINT `FKi7n26ikpd12ne6p7536re9m5h` FOREIGN KEY (`province_id`) REFERENCES `province` (`province_id`),
  CONSTRAINT `FKlhn3c7t57hdly7gwckocrgrnr` FOREIGN KEY (`responsable_id`) REFERENCES `personnel` (`personnel_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `centre`
--

LOCK TABLES `centre` WRITE;
/*!40000 ALTER TABLE `centre` DISABLE KEYS */;
INSERT INTO `centre` VALUES (6,'123 Rue Mohammed V, Casablanca',500000,750000,'2010-05-15','Fonctionnel','Bon état','Fibre optique',10,50,5,20,'مركز التكوين المهني الدار البيضاء','Centre de Formation Professionnelle Casablanca','Centre moderne avec équipements récents',1500.5,'0522123456','0522123457','Formation en informatique et gestion',1,1,1,1,1,NULL),(7,'45 Avenue Hassan II, Meknès',300000,500000,'1995-09-01','Stable','Nécessite rénovation','ADSL',5,30,3,15,'المعهد التقني الزراعي بمكناس','Institut Technique Agricole de Meknès','Besoin de modernisation des équipements agricoles',2000,'0535467890','0535467891','Formation en agriculture et élevage',2,2,2,2,2,NULL),(8,'78 Rue Bab Agnaou, Marrakech',600000,900000,'2015-11-30','Récemment rénové','Excellent','Fibre optique',8,40,4,25,'مدرسة مهن البناء مراكش','École des Métiers du Bâtiment Marrakech','Centre spécialisé avec laboratoires modernes',1800.75,'0524789012','0524789013','Formation en construction et architecture',3,1,3,3,3,NULL),(9,'56 Boulevard du 20 Août, Agadir',400000,600000,'2008-03-20','Fonctionnel','Bon état','ADSL',7,35,6,30,'مركز التكوين في السياحة أكادير','Centre de Formation en Tourisme Agadir','Partenariat avec des hôtels locaux pour stages pratiques',1200.25,'0528901234','0528901235','Formation en hôtellerie et tourisme',4,2,4,4,1,NULL),(10,'90 Avenue Fal Ould Oumeir, Rabat',1000000,1500000,'2018-07-10','Haute performance','Neuf','Fibre optique haut débit',20,100,10,50,'معهد التكنولوجيات المتقدمة الرباط','Institut des Technologies Avancées Rabat','Centre d\'excellence en IA et Big Data',2500,'0537345678','0537345679','Formation en technologies de l\'information',5,1,5,5,2,NULL);
/*!40000 ALTER TABLE `centre` ENABLE KEYS */;
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
