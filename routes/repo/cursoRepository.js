const basicRepository = require("./basicRepository");
const log = require('log4js').getLogger();

module.exports = {
    findAll: async function () {
        log.info("Buscando todos os cursos.");
        try {
            const con = await basicRepository.createConnection();
            const [rows] = await con.execute(
                `SELECT c.id, c.nome
                FROM curso c
                ORDER BY c.id DESC`
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
        log.info("Buscando curso de id " + id);
        try {
            const con = await basicRepository.createConnection();
            const [rows] = await con.execute(
                `SELECT * FROM curso 
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
        log.info("Inserindo aluno");
        log.info(body)
        try {
            const con = await basicRepository.createConnection();
            const result = await con.execute(
                `INSERT INTO curso (nome)
                VALUES ('${body.nome}')`
            );
            log.info(result)
            await con.end();
        } catch (err) {
            log.error(err);
            throw err;
        }
    },
    update: async function (body) {
        log.info("Atualizando curso de id " + body.id);
        log.info(body)
        try {
            const con = await basicRepository.createConnection();
            const result = await con.execute(
                `UPDATE curso SET 
                nome = '${body.nome}'
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
        log.info("Removendo curso de id " + id);
        try {
            const con = await basicRepository.createConnection();
            const result = await con.execute(
                `DELETE FROM curso  
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
                `SELECT COUNT(*) count FROM curso`
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
