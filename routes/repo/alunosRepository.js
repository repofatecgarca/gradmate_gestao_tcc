const basicRepository = require("./basicRepository");
const log = require('log4js').getLogger();

module.exports = {
    findAll: async function () {
        log.info("Buscando todos os alunos.");
        try {
            const con = await basicRepository.createConnection();
            const [rows] = await con.execute(
                `SELECT a.id, a.nome, c.nome AS curso, a.ra, p.nome AS projeto
                FROM aluno a 
                JOIN curso c ON c.id = a.id_curso
                LEFT JOIN projeto p ON p.id = a.id_projeto
                ORDER BY a.id DESC`
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
        log.info("Buscando aluno de id " + id);
        try {
            const con = await basicRepository.createConnection();
            const [rows] = await con.execute(
                `SELECT * FROM aluno 
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
                `INSERT INTO aluno (nome, ra, id_curso, id_projeto)
                VALUES ('${body.nome}', '${body.ra}', ${body.curso}, ${body.projeto})`
            );
            log.info(result)
            await con.end();
        } catch (err) {
            log.error(err);
            throw err;
        }
    },
    update: async function (body) {
        log.info("Atualizando aluno de id " + body.id);
        log.info(body)
        bosta = ""
        if (body.projeto) {
            bosta = ` id_projeto = ${body.projeto}, `;
        }
        try {
            const con = await basicRepository.createConnection();
            const result = await con.execute(
                `UPDATE aluno SET 
                nome = '${body.nome}',
                ra = '${body.ra}', ` + bosta +
                ` id_curso = ${body.curso}
                WHERE id = ${body.id} `
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
                `DELETE FROM aluno  
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
                `SELECT COUNT(*) count FROM aluno`
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
