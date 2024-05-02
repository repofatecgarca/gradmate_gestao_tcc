const basicRepository = require("./basicRepository");
const log = require('log4js').getLogger();

module.exports = {
    findByUserAndPass: async function (user, pass) {
        log.info("Buscando usuário por login e senha.");
        try {
            const con = await basicRepository.createConnection();
            const [rows] = await con.execute(
                "SELECT * FROM login l WHERE l.login = ? AND l.senha = ?",
                [user, pass]
            );
            await con.end();
            return rows[0];
        } catch (err) {
            log.error(err);
            throw err;
        }
    },
    findAll: async function () {
        log.info("Buscando todos os usuários.");
        try {
            const con = await basicRepository.createConnection();
            const [rows] = await con.execute(
                `SELECT l.id, l.email, l.login
                FROM login l
                ORDER BY l.id DESC`
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
        log.info("Buscando usuario de id " + id);
        try {
            const con = await basicRepository.createConnection();
            const [rows] = await con.execute(
                `SELECT * FROM login 
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
        let query;
        log.info("Inserindo usuário");
        log.info(body)
        try {
            const con = await basicRepository.createConnection();
            if (body.senha) {
                query = `INSERT INTO login (\`senha\`, \`email\`, \`login\`, \`permissaoUploadArquivos\`, \`permissaoDownloadArquivos\`, \`permissaoAdmin\`)
                VALUES ('${body.senha}', '${body.email}', '${body.login}', ${body.permissaoUploadArquivos}, ${body.permissaoDownloadArquivos}, ${body.permissaoAdmin})`;
            } else {
                query = `INSERT INTO login (\`email\`, \`login\`, \`permissaoUploadArquivos\`, \`permissaoDownloadArquivos\`, \`permissaoAdmin\`)
                VALUES ('${body.email}','${body.login}', ${body.permissaoUploadArquivos}, ${body.permissaoDownloadArquivos}, ${body.permissaoAdmin})`;
            }
            log.info(query)
            const result = await con.execute(query);
            log.info(result)
            await con.end();
        } catch (err) {
            log.error(err);
            throw err;
        }
    },
    update: async function (body) {
        let query;
        log.info("Atualizando usuário de id " + body.id);
        log.info(body)
        try {
            const con = await basicRepository.createConnection();
            if (body.senha) {
                query = `UPDATE login 
                         SET senha = '${body.senha}', 
                         email = '${body.email}' , 
                         login = '${body.login}', 
                         permissaoUploadArquivos  = ${body.permissaoUploadArquivos},
                         permissaoDownloadArquivos  = ${body.permissaoDownloadArquivos},
                         permissaoAdmin  = ${body.permissaoAdmin}
                         WHERE login.id = ${body.id}`;
            } else {
                query = `UPDATE login 
                         SET email = '${body.email}' , 
                         login = '${body.login}', 
                         permissaoUploadArquivos  = ${body.permissaoUploadArquivos},
                         permissaoDownloadArquivos  = ${body.permissaoDownloadArquivos},
                         permissaoAdmin  = ${body.permissaoAdmin}
                         WHERE login.id = ${body.id}`;
            }
            log.info(query)
            const result = await con.execute(query);
            log.info(result)
            await con.end();
        } catch (err) {
            log.error(err);
            throw err;
        }
    },
    remove: async function (id) {
        log.info("Removendo usuario de id " + id);
        try {
            const con = await basicRepository.createConnection();
            const result = await con.execute(
                `DELETE FROM login  
                WHERE id = ${id}`
            );
            log.info(result)
            await con.end();
        } catch (err) {
            log.error(err);
            throw err;
        }
    }
}
