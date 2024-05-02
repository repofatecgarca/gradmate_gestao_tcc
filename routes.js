const express = require('express');
const router = express.Router();
const log = require('log4js').getLogger();
const login = require('./routes/login');
const logout = require('./routes/logout');
const projetos = require('./routes/projetos');
const meusprojetos = require('./routes/meusprojetos');
const projeto = require('./routes/projeto');
const alunos = require('./routes/alunos');
const aluno = require('./routes/aluno');
const professores = require('./routes/professores');
const usuarios = require('./routes/usuarios');
const cursos = require('./routes/cursos');
const documentos = require('./routes/documentos');

const cursosRepository = require("./routes/repo/cursoRepository.js");
const projetosRepository = require("./routes/repo/projetosRepository.js");
const profRepository = require("./routes/repo/profRepository.js");
const alunosRepository = require("./routes/repo/alunosRepository.js");

router.get('/', login.verify, async (req, res) => {
    log.info("Carregando index...");
    res.render("index", {
        cookies: res.cookie,
        num_alunos: await alunosRepository.numEntries(),
        num_professores: await profRepository.numEntries(),
        num_projetos: await projetosRepository.numEntries(),
        num_cursos: await cursosRepository.numEntries()
    });
});

router.get('/info', login.verify, async (req, res) => {
    res.render("info", { cookies: res.cookie });
});

router.use('/login', login.router);
router.use('/logout', logout.router);
router.use('/projetos', projetos.router);
router.use('/meusprojetos', meusprojetos.router);
router.use('/projeto', projeto.router);
router.use('/alunos', alunos.router);
router.use('/aluno', aluno.router);
router.use('/professores', professores.router);
router.use('/usuarios', usuarios.router);
router.use('/cursos', cursos.router);
router.use('/documentos', documentos.router);

module.exports = router;