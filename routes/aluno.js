const express = require('express');
const router = express.Router();
const log = require('log4js').getLogger();
const login = require('./login');
const alunosRepository = require("./repo/alunosRepository");

router.get('/', login.verify, async (req, res) => {
    const id = req.query.id;
    if (!id) {
        res.sendStatus(404);
        return;
    }
    const aluno = await alunosRepository.findById(id);
    log.info("aluno encontrado: " + JSON.stringify(aluno));
    res.setHeader('Content-Type', 'application/json');
    console.log(aluno);
    res.json({ aluno: aluno } );
});

module.exports = {
    router
}