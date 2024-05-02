const basicRepository = require("./basicRepository");
const log = require('log4js').getLogger();

module.exports = {
    findAll: async function () {
        log.info("Buscando todos os professores.");
        try {
            const con = await basicRepository.createConnection();
            const [rows] = await con.execute(
                `SELECT p.id, p.nome, p.descricao_curta
                FROM professor p
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
        log.info("Buscando professor de id " + id);
        try {
            const con = await basicRepository.createConnection();
            const [rows] = await con.execute(
                `SELECT * FROM professor 
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
        log.info("Inserindo professor");
        log.info(body)
        try {
            const con = await basicRepository.createConnection();
            const result = await con.execute(
                `INSERT INTO professor (nome, descricao_curta, link_curriculo_lattes)
                VALUES ('${body.nome}', '${body.descricao_curta}', '${body.link_curriculo_lattes}')`
            );
            log.info(result)
            await con.end();
        } catch (err) {
            log.error(err);
            throw err;
        }
    },
    update: async function (body) {
        log.info("Atualizando professor de id " + body.id);
        log.info(body)
        try {
            const con = await basicRepository.createConnection();
            const result = await con.execute(
                `UPDATE professor SET 
                nome = '${body.nome}',
                descricao_curta = '${body.descricao_curta}',
                link_curriculo_lattes = '${body.link_curriculo_lattes}'
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
        log.info("Removendo professor de id " + id);
        try {
            const con = await basicRepository.createConnection();
            const result = await con.execute(
                `DELETE FROM professor  
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
                `SELECT COUNT(*) count FROM professor`
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
