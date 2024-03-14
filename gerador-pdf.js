const fs = require("fs");
const puppeteer = require('puppeteer');

const TiposArquivos = {
    // 0
    ATA_DEFESA: 'ata_defesa.html',
    
    // 1
    ATA_QUAL: 'ata_qualificacao.html',
    
    // 2
    CERT_ORIENT_DEF: 'cert_orientador_defesa.html',
    
    // 3
    CERT_ORIENT_QUAL: 'cert_orientador_qualificacao.html',
    
    // 4
    CERT_ADS: 'certificado_ads.html',
    
    // 5
    FICHA_AVAL_DEF: 'ficha_avaliacao_defesa.html',
    
    // 6
    TERM_AUT_FATECS: 'termo_autorizacao_fatecs.html'
}

// Ahhh rapaz eu vou me arrepender de ter feito tanta gambiarra...
async function gerarArquivo(
    tipo_arquivo,
    nome_projeto,
    nome_orientador,
    nome_alunos_projetos,
    nome_professores_convidados
) {
    let html = fs.readFileSync(".\\arquivos\\" + tipo_arquivo, "utf8");

    const dataAtual = new Date();
    const dia = dataAtual.getDate();
    const mes = dataAtual.toLocaleString('pt-BR', { month: 'long' }).toLowerCase();
    const ano = dataAtual.getFullYear();

    switch (tipo_arquivo) {
        case TiposArquivos.ATA_DEFESA: {
            html = html.replaceAll("#pelos_alunos#", nome_alunos_projetos.nomes.length > 1 ? "pelos(as) alunos(as)" : "pelo(a) aluno(a)")
            html = html.replaceAll("#pelos_alunos_upper#", nome_alunos_projetos.nomes.length > 1 ? "PELOS(AS) ALUNOS(AS)" : "PELO(A) ALUNO(A)")
            html = html.replaceAll("#nome_alunos#", getNomeAlunos(nome_alunos_projetos))
            html = html.replaceAll("#nome_alunos_upper#", getNomeAlunos(nome_alunos_projetos).toUpperCase())
            html = html.replaceAll("#nome_orientador#", getNomeOrientador(nome_orientador))
            html = html.replaceAll("#nome_professor1#", getNomeProfessor1(nome_professores_convidados))
            html = html.replaceAll("#nome_professor2#", getNomeProfessor2(nome_professores_convidados))
            html = html.replaceAll("#ass_prof1#", getNomeProfessor1(nome_professores_convidados) ? "__________________________________" : "")
            html = html.replaceAll("#ass_prof2#", getNomeProfessor2(nome_professores_convidados) ? "__________________________________" : "")
            html = html.replaceAll("#nome_projeto#", getNomeProjeto(nome_projeto))
            html = html.replaceAll("#dia#", dia)
            html = html.replaceAll("#mes#", mes)
            html = html.replaceAll("#ano#", ano)
        }
        case TiposArquivos.ATA_QUAL: {
            html = html.replaceAll("#nome_alunos#", getNomeAlunos(nome_alunos_projetos)) //Alunos
            html = html.replaceAll("#nome_orientador#", getNomeOrientador(nome_orientador)) //Professor Orientador
            html = html.replaceAll("#nome_projeto#", getNomeProjeto(nome_projeto))
            html = html.replaceAll("#data#", String(dataAtual.getDate()).padStart(2, '0') + "/" + String(dataAtual.getMonth() + 1).padStart(2, '0') + "/" + dataAtual.getFullYear())
        }
        case TiposArquivos.CERT_ORIENT_DEF: {
            html = html.replaceAll("#nome_orientador#", getNomeOrientador(nome_orientador)) //Professor Orientador
            html = html.replaceAll("#nome_alunos#", getNomeAlunos(nome_alunos_projetos)) //Alunos
            html = html.replaceAll("#nome_projeto#", getNomeProjeto(nome_projeto))
            html = html.replaceAll("#ano#", ano)
        }
        case TiposArquivos.CERT_ORIENT_QUAL: {
            html = html.replaceAll("#nome_orientador#", getNomeOrientador(nome_orientador)) //Professor Orientador
            html = html.replaceAll("#nome_alunos#", getNomeAlunos(nome_alunos_projetos)) //Alunos
            html = html.replaceAll("#nome_projeto#", getNomeProjeto(nome_projeto))
            html = html.replaceAll("#ano#", ano)
        }
        case TiposArquivos.CERT_ADS: {
            html = html.replaceAll("#pelos_alunos#", nome_alunos_projetos.nomes.length > 1 ? "pelos(as) alunos(as)" : "pelo(a) aluno(a)")
            html = html.replaceAll("#nome_alunos#", getNomeAlunos(nome_alunos_projetos)) //Alunos
            html = html.replaceAll("#nome_orientador#", getNomeOrientador(nome_orientador)) //Professor Orientador
            html = html.replaceAll("#nome_professor1#", getNomeProfessor1(nome_professores_convidados)) //Professores Convidados
            html = html.replaceAll("#nome_professor2#", getNomeProfessor2(nome_professores_convidados)) //Professores Convidados
            html = html.replaceAll("#nome_projeto#", getNomeProjeto(nome_projeto))
            html = html.replaceAll("#dia#", dia)
            html = html.replaceAll("#mes#", mes)
            html = html.replaceAll("#ano#", ano)
        }
        case TiposArquivos.FICHA_AVAL_DEF: {
            html = html.replaceAll("#nome_alunos#", getNomeAlunos(nome_alunos_projetos)) //Alunos
            html = html.replaceAll("#nome_orientador#", getNomeOrientador(nome_orientador)) //Professor Orientador
            html = html.replaceAll("#nome_professor1#", getNomeProfessor1NoBraces(nome_professores_convidados)) //Professores Convidados
            html = html.replaceAll("#nome_professor2#", getNomeProfessor2NoBraces(nome_professores_convidados)) //Professores Convidados
            html = html.replaceAll("#nome_projeto#", getNomeProjeto(nome_projeto))
            html = html.replaceAll("#mes#", mes)
            html = html.replaceAll("#ano#", ano)
            html = html.replaceAll("#lbl_prof1#", getNomeProfessor1NoBraces(nome_professores_convidados) ? "Professor Convidado: " : "")
            html = html.replaceAll("#lbl_prof2#", getNomeProfessor2NoBraces(nome_professores_convidados) ? "Professor Convidado: " : "")
        }
        case TiposArquivos.TERM_AUT_FATECS: {
            html = html.replaceAll("#nome_orientador#", getNomeOrientador(nome_orientador)) //Professor Orientador
            html = html.replaceAll("#nome_projeto#", getNomeProjeto(nome_projeto))
            html = html.replaceAll("#data#", String(dataAtual.getDate()).padStart(2, '0') + "/" + String(dataAtual.getMonth() + 1).padStart(2, '0') + "/" + dataAtual.getFullYear())
            html = html.replaceAll("#dia#", dia)
            html = html.replaceAll("#mes#", mes)
            html = html.replaceAll("#ano#", ano)
            html = html.replaceAll("#nome_aluno1#", getNomeAluno1(nome_alunos_projetos))
            html = html.replaceAll("#nome_aluno2#", getNomeAluno2(nome_alunos_projetos))
            html = html.replaceAll("#nome_aluno3#", getNomeAluno3(nome_alunos_projetos))
        }
    }

    let output = '.\\out.pdf';
    console.log(output)

    let landscape = tipo_arquivo == TiposArquivos.CERT_ORIENT_DEF ||
        tipo_arquivo == TiposArquivos.CERT_ORIENT_QUAL ||
        tipo_arquivo == TiposArquivos.CERT_ADS;

    await exportWebsiteAsPdf(html, output, landscape).then(() => {
        console.log('PDF created successfully.');
    });
}

//Alunos
function getNomeAlunos(nome_alunos) {
    console.log(nome_alunos)
    if (nome_alunos.nomes.length == 1) {
        return nome_alunos.nomes[0];
    }

    if (nome_alunos.nomes.length == 2) {
        return nome_alunos.nomes[0] + " e " + nome_alunos.nomes[1];
    }

    if (nome_alunos.nomes.length == 3) {
        return nome_alunos.nomes[0] + ", " + nome_alunos.nomes[1] + " e " + nome_alunos.nomes[2];
    }

}

//Professores Convidados
function getNomeProfessor1(nome_professores) {
    if (nome_professores &&
        nome_professores.nomes &&
        nome_professores.nomes.length >= 1) {
        return nome_professores.nomes[0] + " (Convidado)";
    }
    return "";
}
function getNomeProfessor2(nome_professores) {
    if (nome_professores &&
        nome_professores.nomes &&
        nome_professores.nomes.length >= 2 && 
        !(!nome_professores.nomes[1])) {
        return nome_professores.nomes[1] + " (Convidado)";
    }
    return "";
}
function getNomeProfessor1NoBraces(nome_professores) {
    if (nome_professores &&
        nome_professores.nomes &&
        nome_professores.nomes.length >= 1) {
        return nome_professores.nomes[0];
    }
    return "";
}
function getNomeProfessor2NoBraces(nome_professores) {
    if (nome_professores &&
        nome_professores.nomes &&
        nome_professores.nomes.length >= 2 && 
        !(!nome_professores.nomes[1])) {
        return nome_professores.nomes[1];
    }
    return "";
}
function getNomeOrientador(nome_orientador) {
    return nome_orientador;
}
function getNomeProjeto(nome_projeto) {
    return nome_projeto;
}

function getNomeAluno1(nome_alunos) {
    if (nome_alunos &&
        nome_alunos.nomes &&
        nome_alunos.nomes.length >= 1) {
        return nome_alunos.nomes[0];
    }
    return "";
}
function getNomeAluno2(nome_alunos) {
    if (nome_alunos &&
        nome_alunos.nomes &&
        nome_alunos.nomes.length >= 2 && 
        !(!nome_professores.nomes[1])) {
        return nome_alunos.nomes[1];
    }
    return "";
}
function getNomeAluno3(nome_alunos) {
    if (nome_alunos &&
        nome_alunos.nomes &&
        nome_alunos.nomes.length >= 3 && 
        !(!nome_professores.nomes[2])) {
        return nome_alunos.nomes[2];
    }
    return "";
}

async function exportWebsiteAsPdf(html, outputPath, landscape) {
    const browser = await puppeteer.launch({
        headless: 'new'
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.emulateMediaType('screen');
    const PDF = await page.pdf({
        path: outputPath,
        printBackground: true,
        format: 'A4',
        landscape: landscape
    });
    await browser.close();
    return PDF;
}

module.exports = { gerarArquivo, TiposArquivos }