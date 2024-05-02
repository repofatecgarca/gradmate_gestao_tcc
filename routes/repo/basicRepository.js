const mysql = require('mysql2/promise');

const config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "gradmate"
};

module.exports = {
    createConnection: function () {
        try {
            return mysql.createConnection(config);
        } catch (err) {
            throw err;
        }
    }
}