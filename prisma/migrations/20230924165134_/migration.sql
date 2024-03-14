/*
  Warnings:

  - You are about to drop the `_arquivotoprojeto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `alunosprojeto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projetosarquivo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_arquivotoprojeto` DROP FOREIGN KEY `_ArquivoToProjeto_A_fkey`;

-- DropForeignKey
ALTER TABLE `_arquivotoprojeto` DROP FOREIGN KEY `_ArquivoToProjeto_B_fkey`;

-- DropForeignKey
ALTER TABLE `alunosprojeto` DROP FOREIGN KEY `AlunosProjeto_id_aluno_fkey`;

-- DropForeignKey
ALTER TABLE `alunosprojeto` DROP FOREIGN KEY `AlunosProjeto_id_projeto_fkey`;

-- DropForeignKey
ALTER TABLE `projetosarquivo` DROP FOREIGN KEY `ProjetosArquivo_id_arquivo_fkey`;

-- DropForeignKey
ALTER TABLE `projetosarquivo` DROP FOREIGN KEY `ProjetosArquivo_id_projeto_fkey`;

-- AlterTable
ALTER TABLE `aluno` ADD COLUMN `id_projeto` INTEGER NULL;

-- AlterTable
ALTER TABLE `arquivo` ADD COLUMN `id_projeto` INTEGER NULL,
    ADD COLUMN `tipo` INTEGER NULL;

-- DropTable
DROP TABLE `_arquivotoprojeto`;

-- DropTable
DROP TABLE `alunosprojeto`;

-- DropTable
DROP TABLE `projetosarquivo`;

-- AddForeignKey
ALTER TABLE `Aluno` ADD CONSTRAINT `Aluno_id_projeto_fkey` FOREIGN KEY (`id_projeto`) REFERENCES `Projeto`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Arquivo` ADD CONSTRAINT `Arquivo_id_projeto_fkey` FOREIGN KEY (`id_projeto`) REFERENCES `Projeto`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
