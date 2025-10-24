-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : ven. 24 oct. 2025 à 12:18
-- Version du serveur : 10.11.14-MariaDB-0+deb12u2
-- Version de PHP : 8.3.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `pain11`
--
CREATE DATABASE IF NOT EXISTS `pain11` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `pain11`;

-- --------------------------------------------------------

--
-- Structure de la table `Category`
--

CREATE TABLE `Category` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Déchargement des données de la table `Category`
--

INSERT INTO `Category` (`id`, `name`) VALUES
(1, 'Horlogerie'),
(2, 'Maroquinerie'),
(3, 'Parfumerie');

-- --------------------------------------------------------

--
-- Structure de la table `Commande`
--

CREATE TABLE `Commande` (
  `id` int(11) NOT NULL,
  `profil_id` int(11) NOT NULL,
  `numero_commande` varchar(64) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Déchargement des données de la table `Commande`
--

INSERT INTO `Commande` (`id`, `profil_id`, `numero_commande`, `total`, `date_creation`) VALUES
(1, 1, 'CMD-20251024-3d2d792a', '82950.00', '2025-10-24 07:42:31'),
(14, 1, 'CMD-20251024-9D0DD4C5', '8567.00', '2025-10-24 09:20:53'),
(15, 1, 'CMD-20251024-A9960E4F', '33000.00', '2025-10-24 10:32:23');

-- --------------------------------------------------------

--
-- Structure de la table `image`
--

CREATE TABLE `image` (
  `id` int(11) NOT NULL,
  `produit_id` int(11) NOT NULL,
  `url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `image`
--

INSERT INTO `image` (`id`, `produit_id`, `url`) VALUES
(1, 1, 'https://assets.hermes.com/is/image/hermesproduct/montre-arceau-squelette-40mm--055362WW00-crop-2-0-0-800-800_g.jpg'),
(2, 1, 'https://assets.hermes.com/is/image/hermesproduct/montre-arceau-squelette-40mm--055362WW00-worn-9-0-0-800-800_g.jpg'),
(3, 1, 'https://assets.hermes.com/is/image/hermesproduct/montre-arceau-squelette-40mm--055362WW00-front-3-300-0-800-800_g.jpg'),
(4, 2, 'https://assets.hermes.com/is/image/hermesproduct/montre-arceau-le-temps-suspendu-42mm--408083WW00-front-wm-1-0-0-800-800_g.jpg'),
(5, 2, 'https://assets.hermes.com/is/image/hermesproduct/montre-arceau-le-temps-suspendu-42mm--408083WW00-front-wm-4-0-0-2000-2000-q99_g.jpg'),
(6, 2, 'https://assets.hermes.com/is/image/hermesproduct/montre-arceau-le-temps-suspendu-42mm--408083WW00-front-wm-5-0-0-2000-2000-q99_g.jpg'),
(7, 3, 'https://assets.hermes.com/is/image/hermesproduct/montre-cape-cod-petit-modele-31mm--040245WW00-front-1-300-0-800-800_g.jpg'),
(8, 3, 'https://assets.hermes.com/is/image/hermesproduct/montre-cape-cod-petit-modele-31mm--040245WW00-front-3-300-0-2000-2000-q99_g.jpg'),
(9, 3, 'https://assets.hermes.com/is/image/hermesproduct/montre-cape-cod-petit-modele-31mm--040245WW00-back-5-300-0-2000-2000-q99_g.jpg'),
(10, 3, 'https://assets.hermes.com/is/image/hermesproduct/montre-cape-cod-petit-modele-31mm--040245WW00-side-6-300-0-2000-2000-q99_g.jpg'),
(11, 4, 'https://assets.hermes.com/is/image/hermesproduct/montre-heure-h-petit-modele-25mm--403065WW00-front-1-300-0-800-800_g.jpg'),
(12, 4, 'https://assets.hermes.com/is/image/hermesproduct/montre-heure-h-petit-modele-25mm--403065WW00-crop-4-0-0-2000-2000-q99_g.jpg'),
(13, 4, 'https://assets.hermes.com/is/image/hermesproduct/montre-heure-h-petit-modele-25mm--403065WW00-front-5-300-0-2000-2000-q99_g.jpg'),
(14, 1, 'https://assets.hermes.com/is/image/hermesproduct/montre-arceau-squelette-40mm--055362WW00-front-1-300-0-800-800_g.jpg'),
(15, 2, 'https://assets.hermes.com/is/image/hermesproduct/montre-arceau-le-temps-suspendu-42mm--408083WW00-worn-2-0-0-800-800_g.jpg'),
(16, 3, 'https://assets.hermes.com/is/image/hermesproduct/montre-cape-cod-petit-modele-31mm--040245WW00-worn-2-0-0-800-800_g.jpg'),
(17, 5, 'https://assets.hermes.com/is/image/hermesproduct/portefeuille-bearn-mini--039796CK7U-front-wm-1-0-0-800-800_g.jpg'),
(18, 5, 'https://assets.hermes.com/is/image/hermesproduct/portefeuille-bearn-mini--039796CK7U-above-wm-4-0-0-800-800_g.jpg'),
(19, 6, 'https://assets.hermes.com/is/image/hermesproduct/porte-cartes-h-sellier--084991CA37-front-wm-1-0-0-800-800_g.jpg'),
(20, 6, 'https://assets.hermes.com/is/image/hermesproduct/porte-cartes-h-sellier--084991CA37-back-wm-4-0-0-800-800_g.jpg'),
(21, 6, 'https://assets.hermes.com/is/image/hermesproduct/porte-cartes-h-sellier--084991CA37-worn-9-0-0-800-800_g.jpg'),
(22, 7, 'https://assets.hermes.com/is/image/hermesproduct/portefeuille-maillon-to-go--084021CK37-worn-1-0-0-800-800_g.jpg'),
(23, 7, 'https://assets.hermes.com/is/image/hermesproduct/portefeuille-maillon-to-go--084021CK37-worn-3-0-0-800-800_g.jpg'),
(24, 7, 'https://assets.hermes.com/is/image/hermesproduct/portefeuille-maillon-to-go--084021CK37-worn-4-0-0-800-800_g.jpg'),
(25, 7, 'https://assets.hermes.com/is/image/hermesproduct/portefeuille-maillon-to-go--084021CK37-worn-9-0-0-800-800_g.jpg'),
(26, 8, 'https://assets.hermes.com/is/image/hermesproduct/portefeuille-roulis-slim--082053CKG0-front-wm-1-0-0-800-800_g.jpg'),
(27, 8, 'https://assets.hermes.com/is/image/hermesproduct/portefeuille-roulis-slim--082053CKG0-above-wm-4-0-0-800-800_g.jpg'),
(28, 8, 'https://assets.hermes.com/is/image/hermesproduct/portefeuille-roulis-slim--082053CKG0-back-wm-5-0-0-800-800_g.jpg'),
(29, 9, 'https://assets.hermes.com/is/image/hermesproduct/eau-de-rhubarbe-ecarlate-eau-de-cologne--107161V0-worn-2-0-0-800-800_g.jpg'),
(30, 9, 'https://assets.hermes.com/is/image/hermesproduct/eau-de-rhubarbe-ecarlate-eau-de-cologne--107161V0-worn-3-0-0-800-800_g.jpg'),
(31, 9, 'https://assets.hermes.com/is/image/hermesproduct/eau-de-rhubarbe-ecarlate-eau-de-cologne--107161V0-worn-wm-10-0-0-800-800_g.jpg'),
(32, 10, 'https://assets.hermes.com/is/image/hermesproduct/un-jardin-en-mediterranee-eau-de-toilette--712645.1-worn-2-0-0-800-800_g.jpg'),
(33, 10, 'https://assets.hermes.com/is/image/hermesproduct/un-jardin-en-mediterranee-eau-de-toilette--712645.1-worn-3-0-0-800-800_g.jpg'),
(34, 10, 'https://assets.hermes.com/is/image/hermesproduct/un-jardin-en-mediterranee-eau-de-toilette--712645.1-worn-9-0-0-800-800_g.jpg'),
(35, 10, 'https://assets.hermes.com/is/image/hermesproduct/un-jardin-en-mediterranee-eau-de-toilette--712645.1-worn-10-0-0-800-800_g.jpg'),
(36, 11, 'https://assets.hermes.com/is/image/hermesproduct/eau-des-merveilles-eau-de-toilette--107290V0-worn-2-0-0-800-800_g.jpg'),
(37, 11, 'https://assets.hermes.com/is/image/hermesproduct/eau-des-merveilles-eau-de-toilette--107290V0-worn-3-0-0-800-800_g.jpg'),
(38, 11, 'https://assets.hermes.com/is/image/hermesproduct/eau-des-merveilles-eau-de-toilette--107290V0-worn-9-0-0-800-800_g.jpg'),
(39, 11, 'https://assets.hermes.com/is/image/hermesproduct/eau-des-merveilles-eau-de-toilette--107290V0-worn-10-0-0-800-800_g.jpg'),
(40, 12, 'https://assets.hermes.com/is/image/hermesproduct/twilly-d-hermes-eau-poivree-eau-de-parfum--107167V0-worn-2-0-0-800-800_g.jpg'),
(41, 12, 'https://assets.hermes.com/is/image/hermesproduct/twilly-d-hermes-eau-poivree-eau-de-parfum--107167V0-worn-3-0-0-800-800_g.jpg'),
(42, 12, 'https://assets.hermes.com/is/image/hermesproduct/twilly-d-hermes-eau-poivree-eau-de-parfum--107167V0-worn-9-0-0-800-800_g.jpg'),
(43, 12, 'https://assets.hermes.com/is/image/hermesproduct/twilly-d-hermes-eau-poivree-eau-de-parfum--107167V0-worn-10-0-0-800-800_g.jpg'),
(44, 12, 'https://assets.hermes.com/is/image/hermesproduct/twilly-d-hermes-eau-poivree-eau-de-parfum--107167V0-worn-11-0-0-800-800_g.jpg');

-- --------------------------------------------------------

--
-- Structure de la table `LigneCommande`
--

CREATE TABLE `LigneCommande` (
  `id` int(11) NOT NULL,
  `commande_id` int(11) NOT NULL,
  `produit_id` int(11) DEFAULT NULL,
  `product_variant_id` int(11) DEFAULT NULL,
  `quantite` int(11) NOT NULL,
  `prix_unitaire` decimal(10,2) NOT NULL,
  `options_description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Déchargement des données de la table `LigneCommande`
--

INSERT INTO `LigneCommande` (`id`, `commande_id`, `produit_id`, `product_variant_id`, `quantite`, `prix_unitaire`, `options_description`) VALUES
(1, 1, 1, NULL, 2, '8475.00', NULL),
(2, 1, 2, NULL, 2, '33000.00', NULL),
(21, 14, NULL, 25, 1, '92.00', NULL),
(22, 14, NULL, 2, 1, '8475.00', NULL),
(23, 15, NULL, 6, 1, '33000.00', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `OptionType`
--

CREATE TABLE `OptionType` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Déchargement des données de la table `OptionType`
--

INSERT INTO `OptionType` (`id`, `name`) VALUES
(1, 'Couleur'),
(2, 'Quantité'),
(3, 'Taille');

-- --------------------------------------------------------

--
-- Structure de la table `OptionValue`
--

CREATE TABLE `OptionValue` (
  `id` int(11) NOT NULL,
  `option_type_id` int(11) NOT NULL,
  `value` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Déchargement des données de la table `OptionValue`
--

INSERT INTO `OptionValue` (`id`, `option_type_id`, `value`) VALUES
(1, 1, 'Noir '),
(2, 1, 'Bleu'),
(3, 1, 'Rouge'),
(4, 2, '50mL'),
(5, 2, '75mL'),
(6, 2, '100mL'),
(7, 3, 'Petit'),
(8, 3, 'Moyen'),
(9, 3, 'Grand');

-- --------------------------------------------------------

--
-- Structure de la table `Product`
--

CREATE TABLE `Product` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `category` int(11) NOT NULL,
  `base_price` decimal(10,2) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text NOT NULL,
  `imageUrl` varchar(255) NOT NULL,
  `stock` int(11) DEFAULT NULL,
  `totalStock` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Déchargement des données de la table `Product`
--

INSERT INTO `Product` (`id`, `name`, `category`, `base_price`, `price`, `description`, `imageUrl`, `stock`, `totalStock`) VALUES
(1, 'Montre Arceau Squelette, 40mm', 1, '8475.00', '8475.00', 'La Hermès Arceau Le Temps Suspendu 42 mm (réf. W408083WW00) est une montre poétique qui invite à échapper au temps. Son boîtier en acier poli abrite un cadran argenté opalin orné de chiffres arabes inclinés, typiques de la collection Arceau. Animée par un mouvement automatique Hermès H1912 doté de la fonction exclusive “temps suspendu”, elle permet de figer l’affichage des aiguilles tout en continuant à mesurer le temps en secret. Montée sur un bracelet en alligator noir, cette montre incarne l’esprit **créatif', 'https://assets.hermes.com/is/image/hermesproduct/montre-arceau-squelette-40mm--055362WW00-front-1-300-0-800-800_g.jpg', 50, 50),
(2, 'Montre Arceau Le Temps Suspendu, 42mm', 1, '33000.00', '33000.00', 'La Arceau Squelette 40 mm révèle son cœur mécanique à travers un cadran partiellement transparent. Le boîtier en acier poli arbore les célèbres attaches en forme d’étrier propres à la collection Arceau. Le cadran « smoked » en saphir dégradé laisse entrevoir le mouvement squelette, tandis que les chiffres arabes penchés flottent au-dessus de la mécanique. Montée sur un bracelet en alligator havane (ou autre coloris au choix), cette montre allie technicité et élégance discrète.', 'https://assets.hermes.com/is/image/hermesproduct/montre-arceau-le-temps-suspendu-42mm--408083WW00-front-wm-1-0-0-800-800_g.jpg', 50, 50),
(3, 'Montre Cape Cod, \nPetit modèle, 31mm', 1, '2800.00', '2800.00', 'La Hermès Cape Cod Petit Modèle 31 mm (réf. W040245WW00) allie élégance et simplicité. Son boîtier en acier poli abrite un cadran argenté opalin aux chiffres arabes emblématiques de la maison. Animée par un mouvement quartz suisse, elle est montée sur un bracelet en cuir de veau Swift étoupe, souple et raffiné. Étanche à 3 bar, cette montre incarne le luxe discret et intemporel d’Hermès.', 'https://assets.hermes.com/is/image/hermesproduct/montre-cape-cod-petit-modele-31mm--040245WW00-front-1-300-0-800-800_g.jpg', 50, 50),
(4, 'Montre Heure H, Petit modèle, 25mm', 1, '10150.00', '10150.00', 'La Heure H 25 mm est une montre féminine raffinée qui sublime le design iconique du “H” signé Hermès. Son boîtier en acier serti de diamants entoure un cadran en nacre blanche, lui aussi décoré de diamants, pour une touche de luxe discret. Animée par un mouvement à quartz suisse, elle est montée sur un bracelet court interchangeable en alligator bleu saphir. Cette montre incarne le savoir-faire et l’élégance intemporelle d’Hermès.', 'https://assets.hermes.com/is/image/hermesproduct/montre-heure-h-petit-modele-25mm--403065WW00-front-1-300-0-800-800_g.jpg', 0, 0),
(5, 'Portefeuille Béarn mini', 2, '1920.00', '1920.00', 'Le Portefeuille Béarn Mini incarne l’élégance fonctionnelle et le raffinement du cuir Hermès. Confectionné en cuir Epsom bleu marine, il séduit par sa texture fine et sa tenue impeccable. Sa silhouette compacte est sublimée par la fermeture emblématique à languette et clou “H”, symbole discret de la maison. À l’intérieur, un porte-monnaie à pression et des fentes pour cartes offrent une organisation pratique. Alliant savoir-faire artisanal et design intemporel, ce petit bijou de maroquinerie accompagne le quotidien avec distinction.', 'https://assets.hermes.com/is/image/hermesproduct/portefeuille-bearn-mini--039796CK7U-front-wm-1-0-0-800-800_g.jpg', 50, 50),
(6, 'Porte-cartes H Sellier', 2, '765.00', '765.00', 'Le Porte‑cartes H Sellier incarne l’élégance discrète et le savoir-faire artisanal d’Hermès. Confectionné en veau Evercolor bleu profond, il se distingue par ses surpiqûres sellier et le détail emblématique du “H” cousu à la main. Compact et fonctionnel, il dispose de fentes pour cartes et d’une poche centrale pour organiser l’essentiel avec raffinement. Ce porte‑cartes allie design intemporel et luxe discret, parfait pour accompagner le quotidien avec style.', 'https://assets.hermes.com/is/image/hermesproduct/porte-cartes-h-sellier--084991CA37-front-wm-1-0-0-800-800_g.jpg', 50, 50),
(7, 'Portefeuille Maillon \nTo Go', 2, '4650.00', '4650.00', 'Le Portefeuille Maillon To Go incarne l’élégance moderne et le savoir-faire Hermès. Confectionné en veau Epsom noir, il se distingue par son fermoir Chaîne d’Ancre, signature emblématique de la maison. Sa silhouette allongée offre un compartiment central et des poches pour cartes, tandis que la bandoulière amovible permet de le porter à l’épaule, en travers ou en pochette. Ce portefeuille allie fonctionnalité et design intemporel, parfait pour accompagner le quotidien avec style.', 'https://assets.hermes.com/is/image/hermesproduct/portefeuille-maillon-to-go--084021CK37-worn-1-0-0-800-800_g.jpg', 50, 50),
(8, 'Portefeuille Roulis Slim', 2, '2380.00', '2380.00', 'Le Portefeuille Roulis Slim incarne l’élégance contemporaine et le savoir-faire artisanal d’Hermès. Confectionné en cuir Epsom, il se distingue par sa fermoir Chaîne d’Ancre, signature emblématique de la maison. Sa silhouette épurée offre un compartiment central et des poches pour cartes, permettant une organisation optimale. Compact et fonctionnel, il se porte à la main ou se glisse aisément dans une poche. Ce portefeuille allie design intemporel et luxe discret, parfait pour accompagner le quotidien avec raffinement.', 'https://assets.hermes.com/is/image/hermesproduct/portefeuille-roulis-slim--082053CKG0-front-wm-1-0-0-800-800_g.jpg', 5, 5),
(9, 'Eau du rhubarbe', 3, '92.00', '92.00', 'L’Eau de Rhubarbe Écarlate d’Hermès est une eau de cologne unisexe fraîche et pétillante. Signée par la parfumeuse Christine Nagel, elle mêle la rhubarbe acidulée à des notes légères et musquées pour une fragrance vive et joyeuse. Présentée dans un flacon iconique en forme de lanterne, cette eau de cologne incarne la légèreté, l’énergie et l’élégance intemporelle d’Hermès.', 'https://assets.hermes.com/is/image/hermesproduct/eau-de-rhubarbe-ecarlate-eau-de-cologne--107161V0-worn-2-0-0-800-800_g.jpg', 50, 50),
(10, 'Un Jardin en Méditerranée', 3, '100.00', '100.00', 'L’Eau de Toilette Un Jardin en Méditerranée d’Hermès est une fragrance fraîche et lumineuse qui évoque un jardin baigné de soleil au bord de la mer. Elle mêle notes d’agrumes, fleurs blanches et feuilles de figuier pour une sensation légère et vivifiante. Présentée dans un flacon élégant et épuré, cette eau de toilette incarne la fraîcheur et l’élégance intemporelle d’Hermès.', 'https://assets.hermes.com/is/image/hermesproduct/un-jardin-en-mediterranee-eau-de-toilette--712645.1-worn-2-0-0-800-800_g.jpg', 50, 50),
(11, 'Eau des Merveilles', 3, '110.00', '110.00', 'L’Eau des Merveilles Eau de Toilette d’Hermès est une fragrance boisée et ambrée qui allie fraîcheur et chaleur. Elle mêle notes d’agrumes pétillantes, ambre et bois précieux, pour une composition à la fois lumineuse et enveloppante. Présentée dans un flacon rond orné de motifs étoilés, cette eau de toilette incarne la magie, l’élégance et la créativité intemporelle d’Hermès.', 'https://assets.hermes.com/is/image/hermesproduct/eau-des-merveilles-eau-de-toilette--107290V0-worn-2-0-0-800-800_g.jpg', 50, 50),
(12, 'Twily d’Hermès', 3, '113.00', '113.00', 'L’Eau de Parfum Twilly d’Hermès Eau Poivrée est une fragrance féminine audacieuse et espiègle. Elle mêle poivre rose vibrant, rose délicate et patchouli profond, pour une composition à la fois épicée, florale et boisée. Présentée dans un flacon en forme de lanterne orné d’un ruban en soie coloré, cette eau de parfum incarne l’énergie, la créativité et l’élégance intemporelle d’Hermès.', 'https://assets.hermes.com/is/image/hermesproduct/twilly-d-hermes-eau-poivree-eau-de-parfum--107167V0-worn-2-0-0-800-800_g.jpg', 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `ProductVariant`
--

CREATE TABLE `ProductVariant` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Déchargement des données de la table `ProductVariant`
--

INSERT INTO `ProductVariant` (`id`, `product_id`, `price`, `stock`) VALUES
(1, 1, '8475.00', 50),
(2, 1, '8475.00', 0),
(3, 1, '8475.00', 0),
(4, 2, '33000.00', 50),
(5, 2, '33000.00', 50),
(6, 2, '33000.00', 50),
(7, 3, '2800.00', 50),
(8, 3, '2800.00', 50),
(9, 3, '2800.00', 50),
(10, 4, '10150.00', 0),
(11, 4, '10150.00', 0),
(12, 4, '10150.00', 0),
(13, 5, '1920.00', 50),
(14, 5, '1920.00', 50),
(15, 5, '1920.00', 50),
(16, 6, '765.00', 50),
(17, 6, '765.00', 50),
(18, 6, '765.00', 50),
(19, 7, '4650.00', 50),
(20, 7, '4650.00', 50),
(21, 7, '4650.00', 50),
(22, 8, '2380.00', 5),
(23, 8, '2380.00', 5),
(24, 8, '2380.00', 5),
(25, 9, '92.00', 50),
(26, 9, '92.00', 50),
(27, 9, '92.00', 50),
(28, 10, '100.00', 50),
(29, 10, '100.00', 50),
(30, 10, '100.00', 50),
(31, 11, '110.00', 50),
(32, 11, '110.00', 50),
(33, 11, '110.00', 50),
(34, 12, '113.00', 0),
(35, 12, '113.00', 0),
(36, 12, '113.00', 0);

-- --------------------------------------------------------

--
-- Structure de la table `profil`
--

CREATE TABLE `profil` (
  `id` int(10) UNSIGNED NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `profil`
--

INSERT INTO `profil` (`id`, `nom`, `prenom`, `email`, `password`) VALUES
(4, '', '', 'test@example.com', '$2y$10$6twv/eD0pr53SxPFGJ/Xwe4eoB9Mk.B.r2fWm8EILBeK8.OWD.UzK'),
(5, 'Pain', 'Maud', 'vivienpain@gmail.com', '$2y$10$jqnoyzqNd0oP.Finc6zCAukX1MrsdBdETX7AAItQmuQhsuPw8mumq'),
(6, '', '', 'maud.raux4@gmail.com', '$2y$10$NPo48OYLoHDJqPn0g1we2OvzS/NHsdvM5rGk6EBYubrlheICxstBy'),
(7, '', '', 'aaaaa@gmail.com', '$2y$10$Sd467e5tIaLUe/mqE6OAPu6TLedKEidTRGdyfH28NyHy7J9H4cAo2');

-- --------------------------------------------------------

--
-- Structure de la table `VariantOptionValue`
--

CREATE TABLE `VariantOptionValue` (
  `product_variant_id` int(11) NOT NULL,
  `option_value_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Déchargement des données de la table `VariantOptionValue`
--

INSERT INTO `VariantOptionValue` (`product_variant_id`, `option_value_id`) VALUES
(1, 7),
(2, 8),
(3, 9),
(4, 7),
(5, 8),
(6, 9),
(7, 7),
(8, 8),
(9, 9),
(10, 7),
(11, 8),
(12, 9),
(13, 1),
(14, 2),
(15, 3),
(16, 1),
(17, 2),
(18, 3),
(19, 1),
(20, 2),
(21, 3),
(22, 1),
(23, 2),
(24, 3),
(25, 4),
(26, 5),
(27, 6),
(28, 4),
(29, 5),
(30, 6),
(31, 4),
(32, 5),
(33, 6),
(34, 4),
(35, 5),
(36, 6);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Category`
--
ALTER TABLE `Category`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Commande`
--
ALTER TABLE `Commande`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_commande_unique` (`numero_commande`);

--
-- Index pour la table `image`
--
ALTER TABLE `image`
  ADD PRIMARY KEY (`id`),
  ADD KEY `produit_id` (`produit_id`);

--
-- Index pour la table `LigneCommande`
--
ALTER TABLE `LigneCommande`
  ADD PRIMARY KEY (`id`),
  ADD KEY `commande_id` (`commande_id`),
  ADD KEY `produit_id` (`produit_id`);

--
-- Index pour la table `OptionType`
--
ALTER TABLE `OptionType`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `OptionValue`
--
ALTER TABLE `OptionValue`
  ADD PRIMARY KEY (`id`),
  ADD KEY `option_type_id` (`option_type_id`);

--
-- Index pour la table `Product`
--
ALTER TABLE `Product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category` (`category`);

--
-- Index pour la table `ProductVariant`
--
ALTER TABLE `ProductVariant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `profil`
--
ALTER TABLE `profil`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `VariantOptionValue`
--
ALTER TABLE `VariantOptionValue`
  ADD PRIMARY KEY (`product_variant_id`,`option_value_id`),
  ADD KEY `option_value_id` (`option_value_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `Category`
--
ALTER TABLE `Category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `Commande`
--
ALTER TABLE `Commande`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `image`
--
ALTER TABLE `image`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT pour la table `LigneCommande`
--
ALTER TABLE `LigneCommande`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT pour la table `OptionType`
--
ALTER TABLE `OptionType`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `OptionValue`
--
ALTER TABLE `OptionValue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `Product`
--
ALTER TABLE `Product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT pour la table `ProductVariant`
--
ALTER TABLE `ProductVariant`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT pour la table `profil`
--
ALTER TABLE `profil`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `image`
--
ALTER TABLE `image`
  ADD CONSTRAINT `image_ibfk_1` FOREIGN KEY (`produit_id`) REFERENCES `Product` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `LigneCommande`
--
ALTER TABLE `LigneCommande`
  ADD CONSTRAINT `fk_commande` FOREIGN KEY (`commande_id`) REFERENCES `Commande` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_produit` FOREIGN KEY (`produit_id`) REFERENCES `Product` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `OptionValue`
--
ALTER TABLE `OptionValue`
  ADD CONSTRAINT `fk_optionvalue_optiontype` FOREIGN KEY (`option_type_id`) REFERENCES `OptionType` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Product`
--
ALTER TABLE `Product`
  ADD CONSTRAINT `category` FOREIGN KEY (`category`) REFERENCES `Category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `ProductVariant`
--
ALTER TABLE `ProductVariant`
  ADD CONSTRAINT `fk_variant_product` FOREIGN KEY (`product_id`) REFERENCES `Product` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `VariantOptionValue`
--
ALTER TABLE `VariantOptionValue`
  ADD CONSTRAINT `fk_pivot_optionvalue` FOREIGN KEY (`option_value_id`) REFERENCES `OptionValue` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pivot_variant` FOREIGN KEY (`product_variant_id`) REFERENCES `ProductVariant` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
