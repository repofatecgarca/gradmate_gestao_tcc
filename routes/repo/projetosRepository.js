const basicRepository = require("./basicRepository");
const log = require('log4js').getLogger();

module.exports = {
    findAll: async function () {
        log.info("Buscando todos os projetos.");
        try {
            const con = await basicRepository.createConnection();
            const [rows] = await con.execute(
                `SELECT p.id, p.nome, c.nome AS curso, pf.nome AS professor
                FROM projeto p 
                JOIN curso c ON c.id = p.id_curso
                LEFT JOIN professor pf ON pf.id = p.id_orientador
                ORDER BY p.id DESC`
            );
            log.info(rows)
            await con.end();
            return rows;
        } catch (err) {
            log.error(err);
            throw err;
        }
    },
    findById: async function (id) {
        log.info("Buscando projeto de id " + id);
        try {
            const con = await basicRepository.createConnection();
            const [rows] = await con.execute(
                `SELECT * FROM projeto 
                WHERE id = ${id}`
            );
            log.info(rows)
            await con.end();
            return rows;
        } catch (err) {
            log.error(err);
            throw err;
        }
    },
    insert: async function (body) {
        log.info("Inserindo projeto");
        if (body.orientador === undefined || body.orientador === 'undefined' || body.orientador === "") {
            body.orientador = null;
        }
        log.info(body)
        try {
            const con = await basicRepository.createConnection();
            const result = await con.execute(
                `INSERT INTO projeto (nome, descricao, id_curso, id_orientador)
                VALUES ('${body.nome}', '${body.descricao}', ${body.curso}, ${body.orientador})`
            );
            log.info(result)
            await con.end();
        } catch (err) {
            log.error(err);
            throw err;
        }
    },
    update: async function (body) {
        log.info("Atualizando projeto de id " + body.id);
        if (body.orientador === undefined || body.orientador === 'undefined') {
            body.orientador = null;
        }
        log.info(body)
        try {
            const con = await basicRepository.createConnection();
            const result = await con.execute(
                `UPDATE projeto SET 
                nome = '${body.nome}',
                descricao = '${body.descricao}',
                id_fase = ${body.fase},
                id_curso = ${body.curso},
                id_orientador = ${body.orientador}
                WHERE id = ${body.id}`
            );
            log.info(result)
            await con.end();
        } catch (err) {
            log.error(err);
            throw err;
        }
    },
    remove: async function (id) {
        log.info("Removendo aluno de id " + id);
        try {
            const con = await basicRepository.createConnection();
            const result = await con.execute(
                `DELETE FROM projeto  
                WHERE id = ${id}`
            );
            log.info(result)
            await con.end();
        } catch (err) {
            log.error(err);
            throw err;
        }
    },
    numEntries: async function () {
        try {
            const con = await basicRepository.createConnection();
            const [rows] = await con.execute(
                `SELECT COUNT(*) count FROM projeto`
            );
            log.info(rows)
            await con.end();
            return rows[0].count;
        } catch (err) {
            log.error(err);
            throw err;
        }
    }
}
