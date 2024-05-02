const express = require('express');
const router = express.Router();
const log = require('log4js').getLogger();
const login = require('./login');
const loginRepository = require('./repo/userRepository');

router.get('/', login.verify, async (req, res) => {
    const usuarios = await loginRepository.findAll();
    log.info("Usuarios encontrados: " + JSON.stringify(usuarios));
    res.render("usuarios", { cookies: res.cookie, usuarios: usuarios});
});

router.get('/remove', login.verify, async (req, res) => {
    const id = req.query.id;
    await loginRepository.remove(id);
    log.info("usuario removido: " + id);
    res.redirect("/usuarios");
});

router.get('/form', login.verify, async (req, res) => {
    const id = req.query.id;
    if (id) {
        const usuario = await loginRepository.findById(id);
        if (usuario) {
            log.info("Usuário encontrado: " + JSON.stringify(usuario[0]));
            res.render("usuarios_formulario", {cookies: res.cookie, usuario: JSON.stringify(usuario[0]) });
            return;
        }
    }
    log.info("Assumindo que a página é de adicionar.")
    res.render("usuarios_formulario", {cookies: res.cookie});
});

router.post('/', login.verify, async (req, res) => {
    req.body.permissaoAdmin = !(!(req.body.permissaoAdmin))
    req.body.permissaoDownloadArquivos = !(!(req.body.permissaoDownloadArquivos))
    req.body.permissaoUploadArquivos = !(!(req.body.permissaoUploadArquivos))
    if (req.body.id) {
        await loginRepository.update(req.body);
    } else {
        await loginRepository.insert(req.body);
    }
    res.redirect("usuarios");
});


module.exports = {
    router
}