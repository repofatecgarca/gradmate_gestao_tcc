const express = require('express');
const router = express.Router();
const log = require('log4js').getLogger();
const login = require('./login');
const alunosRepository = require('./repo/alunosRepository');
const cursoRepository = require('./repo/cursoRepository');

router.get('/', login.verify, async (req, res) => {
    const alunos = await alunosRepository.findAll();
    log.info("Alunos encontrados: " + JSON.stringify(alunos));
    res.render("alunos", {cookies: res.cookie, alunos: alunos});
});

router.get('/all', login.verify, async (req, res) => {
    const alunos = await alunosRepository.findAll();
    log.info("Alunos encontrados: " + JSON.stringify(alunos));
    res.send({alunos});
});

router.post('/', login.verify, async (req, res) => {
    console.log(req.body)
    if (req.body.id) {
        await alunosRepository.update(req.body);
    } else {
        await alunosRepository.insert(req.body);
    }
    res.status(200).send({});
});

router.get('/form', login.verify, async (req, res) => {
    const id = req.query.id;
    const cursos = await cursoRepository.findAll();
    if (id) {
        const aluno = await alunosRepository.findById(id);
        if (aluno) {
            log.info("Aluno encontrado: " + JSON.stringify(aluno[0]));
            res.render("alunos_formulario", {cookies: res.cookie, aluno: JSON.stringify(aluno[0]), cursos: cursos});
            return;
        }
    }
    log.info("Assumindo que a página é de adicionar.")
    res.render("alunos_formulario", {cookies: res.cookie, cursos: cursos});
});

router.get('/remove', login.verify, async (req, res) => {
    const id = req.query.id;
    await alunosRepository.remove(id);
    log.info("Aluno removido: " + id);
    res.redirect("/alunos");
});

router.get('/all', login.verify, async (req, res) => {
    const alunos = await alunosRepository.findAll();
    log.info("alunos encontrado: " + JSON.stringify(alunos));
    res.setHeader('Content-Type', 'application/json');
    console.log(alunos);
    res.json({alunos});
});

module.exports = {
    router
}