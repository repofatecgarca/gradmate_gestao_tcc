const express = require('express');
const dotenv = require('dotenv');

const log4js = require('log4js');
const config = require('./config/log4js.json');
log4js.configure(config);
const log = log4js.getLogger();

dotenv.config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", require("./routes.js"))

app.use(express.static('./public'))

app.listen(process.env.APP_PORT, () => {
    log.info(`Servidor iniciado! Escutando a porta ${process.env.APP_PORT}`);
});
