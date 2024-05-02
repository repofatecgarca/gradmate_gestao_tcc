const log = require('log4js').getLogger();
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
    gerarDoc: async function (body, docName) {
        try {
            const template = fs.readFileSync(`./doctemplates/${docName}.ejs`, 'utf-8');
            const htmlContent = ejs.render(template, body);
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setContent(htmlContent, {waitUntil: 'networkidle0'});
            const tempDir = './pdfs';
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir);
            }
            const pdfPath = path.join(tempDir, `document_${Date.now()}.pdf`);
            await page.pdf({path: pdfPath, format: 'A4', landscape: (docName === 'certificado_ads' || docName === 'cert_orientador_qualificacao'|| docName === 'cert_orientador_defesa') });
            await browser.close();

            return pdfPath;
        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            throw error;
        }
    }
}
