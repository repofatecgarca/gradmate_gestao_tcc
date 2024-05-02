DROP DATABASE `gradmate`;
CREATE DATABASE IF NOT EXISTS `gradmate`;
USE gradmate;

-- Tabela login
CREATE TABLE IF NOT EXISTS `login` (
  `id` int NOT NULL AUTO_INCREMENT,
  `senha` varchar(32) NOT NULL,
  `email` varchar(40) NOT NULL,
  `login` varchar(20) NOT NULL,
  `permissaoAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `permissaoUploadArquivos` tinyint(1) NOT NULL DEFAULT '0',
  `permissaoDownloadArquivos` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
);

-- Tabela curso
CREATE TABLE IF NOT EXISTS `curso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `data_insercao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- Tabela professor
CREATE TABLE IF NOT EXISTS `professor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `descricao_curta` varchar(100) DEFAULT NULL,
  `link_curriculo_lattes` varchar(75) DEFAULT NULL,
  `id_login` int DEFAULT NULL,
  `data_insercao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- Tabela aluno
CREATE TABLE IF NOT EXISTS `aluno` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `ra` varchar(50) NOT NULL,
  `id_login` int DEFAULT NULL,
  `id_curso` int DEFAULT NULL,
  `id_projeto` int DEFAULT NULL,
  `data_insercao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- Tabela projeto
CREATE TABLE IF NOT EXISTS `projeto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `descricao` text,
  `bloqueado` tinyint(1) NOT NULL DEFAULT '0',
  `arquivado` tinyint(1) NOT NULL DEFAULT '0',
  `id_curso` int DEFAULT NULL,
  `id_orientador` int DEFAULT NULL,
  `foto_perfil` longblob DEFAULT NULL,
  `data_insercao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

INSERT INTO curso (id, nome) VALUES
(1, 'Análise e desenvolvimento de sistemas'),
(2, 'Mecatrônica'),
(3, 'Manufatura'),
(4, 'AMS/DS'),
(5, 'Eletrônica');

INSERT INTO `login` (`senha`, `email`, `login`, `permissaoUploadArquivos`, `permissaoDownloadArquivos`, `permissaoAdmin`) VALUES
('admin', 'admin@exemplo.com', 'admin', 1, 1, 1);

INSERT INTO professor (nome, descricao_curta, link_curriculo_lattes) VALUES
('Nelson Julio De Oliveira Miranda', 'Professor(a) de Modelagem de Padroes de Projetos', 'https://downloads.mysql.com/docs/refman-4.1-pt.a4.pdf'),
('Leticia Mariano Gimenez', 'Professor(a) de Lingua Inglesa', 'https://downloads.mysql.com/docs/refman-4.1-pt.a4.pdf'),
('Alessandro Aparecido Antonio', 'Professor(a) de Inteligencia Artificial e Aprendizagem de Maquina', 'https://downloads.mysql.com/docs/refman-4.1-pt.a4.pdf'),
('Deise Deolindo Silva', 'Professor(a) de Estatistica Aplicada', 'https://downloads.mysql.com/docs/refman-4.1-pt.a4.pdf'),
('Fabio Rodrigues Goncalves', 'Professor(a) Integracao e Entrega Continua (DevOps)', 'https://downloads.mysql.com/docs/refman-4.1-pt.a4.pdf'),
('Larissa Pavarini Da Luz', 'Professor(a) de Business Intelligence', 'https://downloads.mysql.com/docs/refman-4.1-pt.a4.pdf'),
('Vinicius Godoy', 'Professor(a) de Computação em Nuvem', 'https://downloads.mysql.com/docs/refman-4.1-pt.a4.pdf'),
('Luiz Carlos Querino Filho', 'Professor(a) de Programacao Multiplataforma', 'https://downloads.mysql.com/docs/refman-4.1-pt.a4.pdf');

INSERT INTO projeto (nome, descricao, id_curso, id_orientador) VALUES
("GradMate - Gestão de TCCS", "O GradMate é uma ferramenta destinada para o uso da coordenação da Fatec, com o objetivo de tornar a geração de documentos para trabalhos de conclusão de curso um processo mais prático.", 4, 6),
("Gestão de Estágio", "Software destinado a transformar o gerenciamento de estágios por parte da administração da Fatec algo mais prático.", 4, 6);

INSERT INTO aluno (nome, ra, id_curso, id_projeto) VALUES ('Pablo Antonio Garcia Silva Junior', '37007402-44', 4, 1);
INSERT INTO aluno (nome, ra, id_curso, id_projeto) VALUES ('Davi Biko Dos Santos Batista', '65673854-46', 4, 1);
INSERT INTO aluno (nome, ra, id_curso, id_projeto) VALUES ('César Augusto Rampazo Mantovani Tavares', '24808450-19', 4, 1);
INSERT INTO aluno (nome, ra, id_curso, id_projeto) VALUES ('Matheus Sanches Rodrigues', '23548950-39', 4, 1);
INSERT INTO aluno (nome, ra, id_curso, id_projeto) VALUES ('Isabela Da Fonseca Santos', '94228716-13', 4, 1);
INSERT INTO aluno (nome, ra, id_curso, id_projeto) VALUES ('Fernando De Almeida Bento', '45081394-54', 4, 2);
INSERT INTO aluno (nome, ra, id_curso, id_projeto) VALUES ('Thalita De Araujo Pereira Dos Santos', '49651964-46', 4, 1);
INSERT INTO aluno (nome, ra, id_curso, id_projeto) VALUES ('Helen Cristina Goncalves Da Silva', '76099165-46', 4, 2);
INSERT INTO aluno (nome, ra, id_curso, id_projeto) VALUES ('Cecilia Moreira Dos Reis', '23058108-45', 4, 2);
INSERT INTO aluno (nome, ra, id_curso, id_projeto) VALUES ('Julio Cesar Oliveira Robles', '86195538-70', 4, 2);
INSERT INTO aluno (nome, ra, id_curso, id_projeto) VALUES ('Henrique Scaquette De Souza', '19785886-16', 4, 2);
INSERT INTO aluno (nome, ra, id_curso, id_projeto) VALUES ('Isabella Cristina Piva', '26722961-11', 4, 1);
INSERT INTO aluno (nome, ra, id_curso, id_projeto) VALUES ('João Victor Esteves Camargo', '89193477-63', 4, 2);
INSERT INTO aluno (nome, ra, id_curso, id_projeto) VALUES ('Marcos Vinicius Santos Cardoso', '74003122-33', 4, 2);
INSERT INTO aluno (nome, ra, id_curso, id_projeto) VALUES ('Helena Manoel Polidoro', '50348045-47', 4, 2);

