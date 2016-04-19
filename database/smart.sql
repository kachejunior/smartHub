/*
Navicat MySQL Data Transfer

Source Server         : Venerica_smart
Source Server Version : 50542
Source Host           : venericameat.com:3306
Source Database       : venerica_smart_room

Target Server Type    : MYSQL
Target Server Version : 50542
File Encoding         : 65001

Date: 2016-04-18 18:56:23
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for apis
-- ----------------------------
DROP TABLE IF EXISTS `apis`;
CREATE TABLE `apis` (
  `param` varchar(11) COLLATE utf8_unicode_ci NOT NULL,
  `value` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`param`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for category_zones
-- ----------------------------
DROP TABLE IF EXISTS `category_zones`;
CREATE TABLE `category_zones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `color` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `status` int(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Table structure for door
-- ----------------------------
DROP TABLE IF EXISTS `door`;
CREATE TABLE `door` (
  `lock` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`lock`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for panel_192_168_1_1
-- ----------------------------
DROP TABLE IF EXISTS `panel_192_168_1_1`;
CREATE TABLE `panel_192_168_1_1` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `temperature` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `humidity` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `movement` int(11) DEFAULT NULL,
  `current` int(11) DEFAULT NULL,
  `relay` int(11) DEFAULT NULL,
  `date_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `light` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=318 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Table structure for temp_log
-- ----------------------------
DROP TABLE IF EXISTS `temp_log`;
CREATE TABLE `temp_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `current` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `date_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for thermostat
-- ----------------------------
DROP TABLE IF EXISTS `thermostat`;
CREATE TABLE `thermostat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `temp` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `band` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `up` int(11) DEFAULT NULL,
  `down` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for zone_ips
-- ----------------------------
DROP TABLE IF EXISTS `zone_ips`;
CREATE TABLE `zone_ips` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `zone_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `zone_id` (`zone_id`) USING BTREE,
  CONSTRAINT `zone_ips_ibfk_1` FOREIGN KEY (`zone_id`) REFERENCES `zones` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Table structure for zones
-- ----------------------------
DROP TABLE IF EXISTS `zones`;
CREATE TABLE `zones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `width` double DEFAULT NULL,
  `height` double DEFAULT NULL,
  `status` int(1) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`) USING BTREE,
  CONSTRAINT `zones_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category_zones` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
