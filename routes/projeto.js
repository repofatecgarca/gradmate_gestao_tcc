const express = require('express');
const router = express.Router();
const log = require('log4js').getLogger();
const login = require('./login');
const projetosRepository = require("./repo/projetosRepository");

router.get('/', login.verify, async (req, res) => {
    const id = req.query.id;
    if (!id) {
        res.sendStatus(404);
        return;
    }
    const projeto = await projetosRepository.findById(id);
    log.info("projeto encontrado: " + JSON.stringify(projeto));
    res.setHeader('Content-Type', 'application/json');
    console.log(projeto);
    res.json({ projeto: projeto } );
});

module.exports = {
    router
}