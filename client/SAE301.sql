-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : dim. 22 oct. 2023 à 14:27
-- Version du serveur :  5.7.34
-- Version de PHP : 8.0.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `SAE301`
--

-- --------------------------------------------------------

--
-- Structure de la table `Category`
--

CREATE TABLE `Category` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `Category`
--

INSERT INTO `Category` (`id`, `name`) VALUES
(1, 'Mobilier'),
(2, 'Électronique'),
(3, 'Bureautique'),
(4, 'Cuisine'),
(5, 'Extérieur');

-- --------------------------------------------------------

--
-- Structure de la table `Product`
--

CREATE TABLE `Product` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `category` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `Product`
--

INSERT INTO `Product` (`id`, `name`, `category`) VALUES
(1, 'Chaise de bureau ergonomique', 1),
(2, 'Table en bois massif', 1),
(3, 'Armoire de rangement', 1),
(4, 'Fauteuil lounge', 1),
(5, 'Bibliothèque scandinave', 1),
(6, 'Canapé convertible 3 places', 1),
(7, 'Tabouret réglable', 1),
(8, 'Écran 24 pouces LED', 2),
(9, 'Clavier mécanique', 2),
(10, 'Souris sans fil', 2),
(11, 'Casque audio Bluetooth', 2),
(12, 'Webcam HD', 2),
(13, 'Disque dur externe 1To', 2),
(14, 'Imprimante laser', 3),
(15, 'Lampe de bureau LED', 3),
(16, 'Organisateur de tiroir', 3),
(17, 'Support écran ajustable', 3),
(18, 'Tapis de souris XXL', 3),
(19, 'Cafetière filtre', 4),
(20, 'Grille-pain inox', 4),
(21, 'Mixeur plongeant', 4),
(22, 'Bouilloire électrique', 4),
(23, 'Micro-ondes compact', 4),
(24, 'Poêle antiadhésive 28cm', 4),
(25, 'Salon de jardin 4 places', 5),
(26, 'Parasol déporté', 5),
(27, 'Barbecue à charbon', 5),
(28, 'Banc de terrasse', 5),
(29, 'Guirlande LED extérieure', 5),
(30, 'Coffre de rangement extérieur', 5);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Category`
--
ALTER TABLE `Category`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Product`
--
ALTER TABLE `Product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category` (`category`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `Category`
--
ALTER TABLE `Category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `Product`
--
ALTER TABLE `Product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `Product`
--
ALTER TABLE `Product`
  ADD CONSTRAINT `category` FOREIGN KEY (`category`) REFERENCES `Category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
