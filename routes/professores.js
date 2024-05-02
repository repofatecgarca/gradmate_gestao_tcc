const express = require('express');
const router = express.Router();
const log = require('log4js').getLogger();
const login = require('./login');
const professoresRepository = require("./repo/profRepository");
const alunosRepository = require("./repo/alunosRepository");
const cursoRepository = require("./repo/cursoRepository");

router.get('/', login.verify, async (req, res) => {
    const professores = await professoresRepository.findAll();
    log.info("Professores encontrados: " + JSON.stringify(professores));
    res.render("professores", { cookies: res.cookie, professores: professores});
});

router.get('/all', login.verify, async (req, res) => {
    const professores = await professoresRepository.findAll();
    log.info("Professores encontrados: " + JSON.stringify(professores));
    res.send({professores});
});

router.get('/professor', login.verify, async (req, res) => {
    const id = req.query.id;
    if (!id) {
        res.sendStatus(404);
        return;
    }
    const aluno = await professoresRepository.findById(id);
    log.info("professor encontrado: " + JSON.stringify(aluno));
    res.setHeader('Content-Type', 'application/json');
    console.log(aluno);
    res.json({ professor: aluno } );
});

router.get('/data', login.verify, async (req, res) => {
    const professores = await professoresRepository.findAll();
    log.info("Professores encontrados: " + JSON.stringify(professores));
    res.send(professores);
});

router.post('/', login.verify, async (req, res) => {
    if (req.body.id) {
        await professoresRepository.update(req.body);
    } else {
        await professoresRepository.insert(req.body);
    }
    res.redirect("professores");
});

router.get('/form', login.verify, async (req, res) => {
    const id = req.query.id;
    if (id) {
        const prof = await professoresRepository.findById(id);
        if (prof) {
            log.info("Professor encontrado: " + JSON.stringify(prof[0]));
            res.render("professores_formulario", {cookies: res.cookie, professor: JSON.stringify(prof[0]) });
            return;
        }
    }
    log.info("Assumindo que a página é de adicionar.")
    res.render("professores_formulario", {cookies: res.cookie});
});

router.get('/remove', login.verify, async (req, res) => {
    const id = req.query.id;
    await professoresRepository.remove(id);
    log.info("Professor removido: " + id);
    res.redirect("/professores");
});

module.exports = {
    router
}