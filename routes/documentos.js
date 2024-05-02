const express = require('express');
const router = express.Router();
const log = require('log4js').getLogger();
const login = require('./login');
const gerardocs = require('./gerardocs/gerardocs');

router.get('/', login.verify, async (req, res) => {
    res.render("documentos", {cookies: res.cookie });
});

router.post('/', login.verify, async (req, res) => {
    console.log(req.body)
    const pdfPath = await gerardocs.gerarDoc(req.body, req.body.docType)
    console.log("baixando:")
    console.log(pdfPath)
    res.download(pdfPath, `${Date.now()}.pdf`, (err) => {
        if (err) console.log(err)
    });
});


module.exports = {
    router
}