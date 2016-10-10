-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema quizdb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `quizdb` ;

-- -----------------------------------------------------
-- Schema quizdb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `quizdb` DEFAULT CHARACTER SET utf8 ;
USE `quizdb` ;

-- -----------------------------------------------------
-- Table `User`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `User` ;

CREATE TABLE IF NOT EXISTS `User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Quiz`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Quiz` ;

CREATE TABLE IF NOT EXISTS `Quiz` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Score`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Score` ;

CREATE TABLE IF NOT EXISTS `Score` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` FLOAT NULL,
  `user_id` INT NOT NULL,
  `quiz_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Score_User_idx` (`user_id` ASC),
  INDEX `fk_Score_Quiz1_idx` (`quiz_id` ASC),
  CONSTRAINT `fk_Score_User`
    FOREIGN KEY (`user_id`)
    REFERENCES `User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Score_Quiz1`
    FOREIGN KEY (`quiz_id`)
    REFERENCES `Quiz` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Question`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Question` ;

CREATE TABLE IF NOT EXISTS `Question` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `quiz_id` INT NOT NULL,
  `question_text` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Question_Quiz1_idx` (`quiz_id` ASC),
  CONSTRAINT `fk_Question_Quiz1`
    FOREIGN KEY (`quiz_id`)
    REFERENCES `Quiz` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Answer`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Answer` ;

CREATE TABLE IF NOT EXISTS `Answer` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `question_id` INT NOT NULL,
  `answer_text` VARCHAR(255) NULL,
  `is_correct` TINYINT(1) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Answer_Question1_idx` (`question_id` ASC),
  CONSTRAINT `fk_Answer_Question1`
    FOREIGN KEY (`question_id`)
    REFERENCES `Question` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SET SQL_MODE = '';
GRANT USAGE ON *.* TO quizuser;
 DROP USER quizuser;
SET SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';
CREATE USER 'quizuser' IDENTIFIED BY 'quiz';

GRANT SELECT, INSERT, TRIGGER, UPDATE, DELETE ON TABLE * TO 'quizuser';

-- -----------------------------------------------------
-- Data for table `User`
-- -----------------------------------------------------
START TRANSACTION;
USE `quizdb`;
INSERT INTO `User` (`id`, `username`, `password`) VALUES (1, 'testUser', 'password');
INSERT INTO `User` (`id`, `username`, `password`) VALUES (2, 'testTwo', 'pass123');
INSERT INTO `User` (`id`, `username`, `password`) VALUES (3, 'testThree', 'pword456');

COMMIT;


-- -----------------------------------------------------
-- Data for table `Quiz`
-- -----------------------------------------------------
START TRANSACTION;
USE `quizdb`;
INSERT INTO `Quiz` (`id`, `name`) VALUES (1, 'Quiz 1');
INSERT INTO `Quiz` (`id`, `name`) VALUES (2, 'Quiz 2');
INSERT INTO `Quiz` (`id`, `name`) VALUES (3, 'Quiz 3');

COMMIT;


-- -----------------------------------------------------
-- Data for table `Score`
-- -----------------------------------------------------
START TRANSACTION;
USE `quizdb`;
INSERT INTO `Score` (`id`, `value`, `user_id`, `quiz_id`) VALUES (1, 88, 1, 1);
INSERT INTO `Score` (`id`, `value`, `user_id`, `quiz_id`) VALUES (2, 76.5, 1, 2);

COMMIT;


-- -----------------------------------------------------
-- Data for table `Question`
-- -----------------------------------------------------
START TRANSACTION;
USE `quizdb`;
INSERT INTO `Question` (`id`, `quiz_id`, `question_text`) VALUES (1, 1, 'Imagine how is touch the sky?');
INSERT INTO `Question` (`id`, `quiz_id`, `question_text`) VALUES (2, 1, 'Yes?');
INSERT INTO `Question` (`id`, `quiz_id`, `question_text`) VALUES (3, 1, 'What Will Rick Astley Never Do?');
INSERT INTO `Question` (`id`, `quiz_id`, `question_text`) VALUES (4, 2, 'What is your favorite color?');
INSERT INTO `Question` (`id`, `quiz_id`, `question_text`) VALUES (5, 2, 'What is your quest?');
INSERT INTO `Question` (`id`, `quiz_id`, `question_text`) VALUES (6, 2, 'What is the air-speed velocity of an unladen swallow?');
INSERT INTO `Question` (`id`, `quiz_id`, `question_text`) VALUES (7, 3, 'Question 1');
INSERT INTO `Question` (`id`, `quiz_id`, `question_text`) VALUES (8, 3, 'Question 2');
INSERT INTO `Question` (`id`, `quiz_id`, `question_text`) VALUES (9, 3, 'Question 3');

COMMIT;


-- -----------------------------------------------------
-- Data for table `Answer`
-- -----------------------------------------------------
START TRANSACTION;
USE `quizdb`;
INSERT INTO `Answer` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES (1, 1, 'Yes.', true);
INSERT INTO `Answer` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES (2, 1, 'No.', false);
INSERT INTO `Answer` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES (3, 2, 'What?', false);
INSERT INTO `Answer` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES (4, 2, 'No.', true);
INSERT INTO `Answer` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES (5, 3, 'Give You Up', true);
INSERT INTO `Answer` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES (6, 3, 'Abscond To Canada', false);
INSERT INTO `Answer` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES (7, 4, 'Blue! No, Green!', false);
INSERT INTO `Answer` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES (8, 4, 'Periwinkle ', true);
INSERT INTO `Answer` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES (9, 5, 'To seek the Grail!', true);
INSERT INTO `Answer` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES (10, 5, 'Break the Undead Curse', false);
INSERT INTO `Answer` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES (11, 6, '42', false);
INSERT INTO `Answer` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES (12, 6, 'African or European swallow?', true);
INSERT INTO `Answer` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES (13, 7, 'Correct!', true);
INSERT INTO `Answer` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES (14, 7, 'Wrong', false);
INSERT INTO `Answer` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES (15, 8, 'Incorrect', false);
INSERT INTO `Answer` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES (16, 8, 'Affirmative', true);
INSERT INTO `Answer` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES (17, 9, 'Yes', true);
INSERT INTO `Answer` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES (18, 9, 'No', false);

COMMIT;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
