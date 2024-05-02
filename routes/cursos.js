const express = require('express');
const router = express.Router();
const log = require('log4js').getLogger();
const login = require('./login');
const cursoRepository = require('./repo/cursoRepository');

router.get('/', login.verify, async (req, res) => {
    const cursos = await cursoRepository.findAll();
    log.info("Cursos encontrados: " + JSON.stringify(cursos));
    res.render("cursos", {cookies: res.cookie, cursos: cursos});
});

router.get('/all', login.verify, async (req, res) => {
    const cursos = await cursoRepository.findAll();
    log.info("Cursos encontrados: " + JSON.stringify(cursos));
    res.send({cursos});
});

router.get('/curso', login.verify, async (req, res) => {
    const id = req.query.id;
    if (!id) {
        res.sendStatus(404);
        return;
    }
    const aluno = await cursoRepository.findById(id);
    log.info("curso encontrado: " + JSON.stringify(aluno));
    res.setHeader('Content-Type', 'application/json');
    console.log(aluno);
    res.json({curso: aluno});
});

router.get('/data', login.verify, async (req, res) => {
    const cursos = await cursoRepository.findAll();
    log.info("Cursos encontrados: " + JSON.stringify(cursos));
    res.send(cursos);
});

router.post('/', login.verify, async (req, res) => {
    if (req.body.id) {
        await cursoRepository.update(req.body);
    } else {
        await cursoRepository.insert(req.body);
    }
    res.redirect("cursos");
});

router.get('/form', login.verify, async (req, res) => {
    const id = req.query.id;
    if (id) {
        const curso = await cursoRepository.findById(id);
        if (curso) {
            log.info("Curso encontrado: " + JSON.stringify(curso[0]));
            res.render("cursos_formulario", {cookies: res.cookie, curso: JSON.stringify(curso[0])});
            return;
        }
    }
    log.info("Assumindo que a página é de adicionar.")
    res.render("cursos_formulario", {cookies: res.cookie});
});

router.get('/remove', login.verify, async (req, res) => {
    const id = req.query.id;
    await cursoRepository.remove(id);
    log.info("Curso removido: " + id);
    res.redirect("/cursos");
});

module.exports = {
    router
}