const express = require('express');
const router = express.Router();
const log = require('log4js').getLogger();
const login = require('./login');
const projetosRepository = require("./repo/projetosRepository");
const professoresRepository = require("./repo/profRepository");
const cursoRepository = require("./repo/cursoRepository");

router.get('/', login.verify, async (req, res) => {
    const projetos = await projetosRepository.findAll();
    log.info("Projetos encontrados: " + JSON.stringify(projetos));
    res.render("projetos", {cookies: res.cookie, projetos: projetos});
});

router.get('/remove', login.verify, async (req, res) => {
    const id = req.query.id;
    await projetosRepository.remove(id);
    log.info("projeto removido: " + id);
    res.redirect("/projetos");
});

router.get('/all', login.verify, async (req, res) => {
    const projetos = await projetosRepository.findAll();
    log.info("Projetos encontrados: " + JSON.stringify(projetos));
    res.send(projetos);
});

router.get('/data', login.verify, async (req, res) => {
    const projetos = await projetosRepository.findAll();
    log.info("Projetos encontrados: " + JSON.stringify(projetos));
    res.send(projetos);
});

router.post('/', login.verify, async (req, res) => {
    if (req.body.id) {
        await projetosRepository.update(req.body);
    } else {
        await projetosRepository.insert(req.body);
    }
    res.status(200).send();
});


module.exports = {
    router
}