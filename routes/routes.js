const express = require('express')
const loginService = require('./login')
const pdf = require('../gerador-pdf')
const router = express.Router()

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const path = require('path');
const fs = require('fs').promises;

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ALUNO = 0
const ORIENTADOR = 1
const ADMINISTRADOR = 2

router.use((req, res, next) => {
    const horarioAtual = new Date().toUTCString();
    console.log(`${horarioAtual} - Carregando ${req.path}`)
    next()
})

router.post('/login', loginService.login);

router.get('/login', (req, res, next) => res.redirect('/'))
router.get('/logout', loginService.logout);

//
//
//
// Rotas para buscar páginas
//
//
//

router.get('/', loginService.checkToken, async (req, res) => {
    userType = res.cookie.decodedInfo.userType
    switch (userType) {
        case ALUNO: {
            const userId = res.cookie.decodedInfo.userId;
            const aluno = await prisma.aluno.findFirst({ where: { id_usuario: userId }, include: { Curso: true, Projeto: true } })
            res.render('indexAluno.ejs', {
                aluno: aluno,
                listaProjetos: [aluno.Projeto],
                userInfo: res.cookie.decodedInfo
            })
            return;
        }
        case ORIENTADOR: {
            const userId = res.cookie.decodedInfo.userId;
            const professor = await prisma.professor.findFirst({
                where: {
                    id_usuario: userId
                },
                include: {
                    Usuario: true
                }
            })
            const listaProjetos = await prisma.projeto.findMany({ where: { id_orientador: professor.id } })
            res.render('indexOrientador.ejs', {
                professor: professor,
                listaProjetos: listaProjetos,
                userInfo: res.cookie.decodedInfo
            })
            return;
        }
        case ADMINISTRADOR: {
            res.render('indexAdministrador.ejs', {
                userInfo: res.cookie.decodedInfo
            })
            return;
        }
    }
})

router.get('/coordenador/alunos', loginService.checkToken, loginService.isAdmin, async (req, res, next) => {
    const alunos = await prisma.aluno.findMany({
        include: {
            Curso: true,
            Usuario: true
        }
    });

    const cursos = await prisma.curso.findMany({});

    res.render('coordenadorAlunos.ejs', {
        alunos: alunos,
        cursos: cursos,
        userInfo: res.cookie.decodedInfo
    })
})

router.get('/coordenador/orientadores', loginService.checkToken, loginService.isAdmin, async (req, res, next) => {
    const orientadores = await prisma.professor.findMany({
        include: {
            Usuario: true
        }
    });
    res.render('coordenadorOrientadores.ejs', {
        orientadores: orientadores,
        userInfo: res.cookie.decodedInfo
    })
})

router.get('/coordenador/projetos', loginService.checkToken, loginService.isAdmin, async (req, res, next) => {
    const projetos = await prisma.projeto.findMany({ include: { Curso: true } });
    const cursos = await prisma.curso.findMany();
    res.render('coordenadorProjetos.ejs', {
        projetos: projetos,
        cursos: cursos,
        userInfo: res.cookie.decodedInfo
    })
})

router.get('/coordenador/cursos', loginService.checkToken, loginService.isAdmin, async (req, res, next) => {
    const cursos = await prisma.curso.findMany();
    res.render('coordenadorCursos.ejs', {
        cursos: cursos,
        userInfo: res.cookie.decodedInfo
    })
})

router.get('/projeto/:id', loginService.checkToken, async (req, res, next) => {
    const id = req.params.id;
    const projeto = await prisma.projeto.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            Aluno: true,
            Arquivo: true
        }
    })
    res.render('projeto.ejs', {
        projeto: projeto,
        userInfo: res.cookie.decodedInfo
    })
})

//
//
//
// Rotas de cadastro
//
//
//

router.post('/aluno', loginService.checkToken, loginService.isAdmin, async (req, res, next) => {
    try {
        const { nome, ra, idCurso, termo, email } = req.body;

        senha = await loginService.novaSenha(nome, ra, email);

        await prisma.usuario.create({
            data: {
                login: email,
                senha: await loginService.encryptPassword(senha),
                tipo: 0,
                Aluno: {
                    create: {
                        nome: nome,
                        ra: ra,
                        termo: parseInt(termo),
                        Curso: {
                            connect: {
                                id: parseInt(idCurso)
                            }
                        }
                    }
                },
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400);
    } finally {
        res.redirect('/coordenador/alunos');
    }
});

router.post('/aluno/edit', loginService.checkToken, loginService.isAdmin, async (req, res, next) => {
    try {
        const { id, nome, ra, idCurso, termo, email } = req.body;

        await prisma.aluno.update({
            where: {
                id: parseInt(id)
            },
            data: {
                nome: nome,
                ra: ra,
                termo: parseInt(termo),
                Usuario: {
                    update: {
                        login: email
                    }
                },
                Curso: {
                    connect: {
                        id: parseInt(idCurso)
                    }
                }
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400);
    } finally {
        res.redirect('/coordenador/alunos');
    }
});

router.put('/api/edit-projeto', loginService.checkToken, async (req, res, next) => {
    try {
        const { id, descricao } = req.body;

        await prisma.projeto.update({
            where: {
                id: parseInt(id)
            },
            data: {
                descricao: descricao.trim()
            }
        });
        res.status(200);
    } catch (error) {
        console.log(error);
        res.status(400);
    } finally {
        res.end();
    }
});

router.get('/aluno/delete/:id', loginService.checkToken, loginService.isAdmin, async (req, res, next) => {
    try {
        const id = req.params.id;
        await prisma.aluno.delete({ where: { id: parseInt(id) } })
    } catch (error) {
        console.log(error);
        res.status(400);
    } finally {
        res.redirect('/coordenador/alunos');
    }
});

router.post('/professor', loginService.checkToken, loginService.isAdmin, async (req, res, next) => {
    try {
        const { nome, email } = req.body;

        senha = await loginService.novaSenha(nome, '12345678913', email);

        await prisma.usuario.create({
            data: {
                login: email,
                senha: await loginService.encryptPassword(senha),
                tipo: 1,
                Professor: {
                    create: {
                        nome: nome,
                    }
                },
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400);
    } finally {
        res.redirect('/coordenador/orientadores');
    }
});

router.post('/professor/edit', loginService.checkToken, loginService.isAdmin, async (req, res, next) => {
    try {
        const { id, nome, email } = req.body;

        await prisma.professor.update({
            where: {
                id: parseInt(id)
            },
            data: {
                nome: nome,
                Usuario: {
                    update: {
                        login: email
                    }
                }
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400);
    } finally {
        res.redirect('/coordenador/orientadores');
    }
});

router.get('/professor/delete/:id', loginService.checkToken, loginService.isAdmin, async (req, res, next) => {
    try {
        const id = req.params.id;
        await prisma.professor.delete({ where: { id: parseInt(id) } })
    } catch (error) {
        console.log(error);
        res.status(400);
    } finally {
        res.redirect('/coordenador/orientadores');
    }
});

router.post('/projeto', loginService.checkToken, loginService.isAdmin, async (req, res, next) => {
    try {
        const { nome, descricao, situacao, curso } = req.body;

        await prisma.projeto.create({
            data: {
                nome: nome,
                descricao: descricao,
                status: parseInt(situacao),
                id_curso: parseInt(curso)
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400);
    } finally {
        res.redirect('/coordenador/projetos');
    }
});

router.post('/projeto/edit', loginService.checkToken, loginService.isAdmin, async (req, res, next) => {
    try {
        const { id, nome, descricao, situacao, curso } = req.body;

        await prisma.projeto.update({
            where: {
                id: parseInt(id)
            },
            data: {
                nome: nome,
                descricao: descricao,
                status: parseInt(situacao),
                id_curso: parseInt(curso)
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400);
    } finally {
        res.redirect('/coordenador/projetos');
    }
});

router.get('/projeto/delete/:id', loginService.checkToken, loginService.isAdmin, async (req, res, next) => {
    try {
        const id = req.params.id;
        await prisma.projeto.delete({ where: { id: parseInt(id) } })
    } catch (error) {
        console.log(error);
        res.status(400);
    } finally {
        res.redirect('/coordenador/projetos');
    }
});

router.post('/projeto/vincular', loginService.checkToken, loginService.isAdmin, async (req, res, next) => {
    try {
        const { id, idAlunos, idProfessor } = req.body;

        const projeto = await prisma.projeto.findUnique({ where: { id: Number(id) } });
        const alunos = idAlunos ? await prisma.aluno.findMany({ where: { id: { in: idAlunos.map(Number) } } }) : null;
        const professor = idProfessor ? await prisma.professor.findUnique({ where: { id: Number(idProfessor) } }) : null;

        await prisma.aluno.updateMany({
            where: { id_projeto: parseInt(projeto.id) },
            data: { id_projeto: null }
        });

        if (alunos) {
            await prisma.projeto.update({
                where: { id: parseInt(id) },
                data: {
                    Aluno: {
                        disconnect: alunos.map(aluno => ({ id: parseInt(aluno.id) }))
                    }
                }
            });

            await prisma.aluno.updateMany({
                where: { id: { in: alunos.map(aluno => parseInt(aluno.id)) } },
                data: { id_projeto: parseInt(projeto.id) }
            });
        }

        await prisma.projeto.update({
            where: { id: parseInt(id) },
            data: {
                Orientador: professor
                    ? { connect: { id: parseInt(professor.id) } }
                    : { disconnect: true }
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400);
    } finally {
        res.redirect('/coordenador/projetos');
    }
});

router.post('/curso', loginService.checkToken, loginService.isAdmin, async (req, res, next) => {
    try {
        const { nome } = req.body;

        await prisma.curso.create({
            data: {
                nome: nome
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400);
    } finally {
        res.redirect('/coordenador/cursos');
    }
});

router.post('/curso/edit', loginService.checkToken, loginService.isAdmin, async (req, res, next) => {
    try {
        const { id, nome } = req.body;

        await prisma.curso.update({
            where: {
                id: parseInt(id)
            },
            data: {
                nome: nome
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400);
    } finally {
        res.redirect('/coordenador/cursos');
    }
});

router.get('/curso/delete/:id', loginService.checkToken, loginService.isAdmin, async (req, res, next) => {
    try {
        const id = req.params.id;
        await prisma.curso.delete({ where: { id: parseInt(id) } })
    } catch (error) {
        console.log(error);
        res.status(400);
    } finally {
        res.redirect('/coordenador/cursos');
    }
});

router.post('/curso/vincular', loginService.checkToken, loginService.isAdmin, async (req, res, next) => {
    try {
        const { id, idAlunos } = req.body;

        const curso = await prisma.curso.findUnique({ where: { id: Number(id) } });
        const alunos = idAlunos ? await prisma.aluno.findMany({ where: { id: { in: idAlunos.map(Number) } } }) : null;

        await prisma.aluno.updateMany({
            where: { id_curso: parseInt(curso.id) },
            data: { id_curso: null }
        });

        if (alunos) {
            await prisma.curso.update({
                where: { id: parseInt(id) },
                data: {
                    Alunos: {
                        disconnect: alunos.map(aluno => ({ id: parseInt(aluno.id) }))
                    }
                }
            });

            await prisma.aluno.updateMany({
                where: { id: { in: alunos.map(aluno => parseInt(aluno.id)) } },
                data: { id_curso: parseInt(curso.id) }
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400);
    } finally {
        res.redirect('/coordenador/cursos');
    }
});

router.post('/usuario/novasenha', loginService.checkToken, loginService.isAdmin, async (req, res, next) => {
    try {
        const { id, senha, email } = req.body;
        console.log(id);

        loginService.enviarEmail(senha, email);

        await prisma.usuario.update({
            where: {
                id: parseInt(id)
            },
            data: {
                senha: await loginService.encryptPassword(senha)
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400);
    } finally {
        res.redirect('/');
    }
});

router.post('/projeto/gerar-arquivos', loginService.checkToken, loginService.isAdmin, async (req, res, next) => {
    try {
        const { id, convidado1, convidado2, tipo_arquivo } = req.body;

        let tipoArquivo = ""
        let temp = Number(tipo_arquivo);
        switch (temp) {
            case 0: tipoArquivo = pdf.TiposArquivos.ATA_DEFESA; break;
            case 1: tipoArquivo = pdf.TiposArquivos.ATA_QUAL; break;
            case 2: tipoArquivo = pdf.TiposArquivos.CERT_ORIENT_DEF; break;
            case 3: tipoArquivo = pdf.TiposArquivos.CERT_ORIENT_QUAL; break;
            case 4: tipoArquivo = pdf.TiposArquivos.CERT_ADS; break;
            case 5: tipoArquivo = pdf.TiposArquivos.FICHA_AVAL_DEF; break;
            case 6: tipoArquivo = pdf.TiposArquivos.TERM_AUT_FATECS; break;
        }

        if (!tipoArquivo) {
            console.log("Não tem arquivo tipo " + tipoArquivo)
            res.status(400)
            res.redirect('/coordenador/projetos')
            return;
        }

        let projeto = await prisma.projeto.findFirst({ where: { id: parseInt(id) }, include: { Aluno: true, Orientador: true } });
        await pdf.gerarArquivo(
            tipoArquivo,
            projeto.nome,
            projeto.Orientador.nome,
            { nomes: projeto.Aluno.map(aluno => aluno.nome) },
            { nomes: [convidado1, convidado2] }
        )

        res.download('./out.pdf', 'out.pdf', (err) => { if (err) console.log(err) });
    } catch (error) {
        console.log(error);
        res.status(400);
    } finally {
    }
});

//
//
//
// FETCH
//
//
//

router.get('/api/alunos-e-professores', async (req, res, next) => {
    const alunos = await prisma.aluno.findMany({ include: { Projeto: true } });
    const professores = await prisma.professor.findMany({ include: { Projeto: true } });
    return res.send({ alunos: alunos, professores: professores })
})

router.get('/api/alunos', async (req, res, next) => {
    const alunos = await prisma.aluno.findMany({ include: { Curso: true } });
    return res.send({ alunos: alunos })
})

router.post('/api/upload-document/', upload.single('arquivo'), async (req, res) => {
    const { id, documentType } = req.body;
    const { originalname, buffer } = req.file;

    try {
        const arquivoExistente = await prisma.arquivo.findFirst({
            where: {
                id_projeto: parseInt(id),
                tipo: parseInt(documentType),
            }
        });

        if (arquivoExistente) {
            console.log('Deletando arquivo existente:', arquivoExistente);
            await prisma.arquivo.delete({ where: { id: arquivoExistente.id } });
        }

        console.log(originalname)

        const arquivoSalvo = await prisma.arquivo.create({
            data: {
                descricao: originalname,
                tipo: parseInt(documentType),
                id_projeto: parseInt(id),
                arquivo: buffer,
            },
        });

        res.status(200).json({ message: 'Arquivo enviado com sucesso', arquivo: arquivoSalvo });
    } catch (error) {
        console.error('Erro ao salvar arquivo:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/api/download-document/', async (req, res) => {
    const { id, documentType } = req.body;
    try {
        const arquivo = await prisma.arquivo.findFirst({
            where: { id_projeto: parseInt(id), tipo: parseInt(documentType) }
        });

        if (!arquivo) {
            console.log('Arquivo não encontrado :v');
            return res.status(404).send('');
        }

        const fileName = arquivo.descricao;
        const fileBuffer = arquivo.arquivo;

        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', 'application/octet-stream');

        res.send(fileBuffer);
    } catch (error) {
        console.log(error)
    }
});

module.exports = router

