const con = require('../db')

const login = (req, res) => {
    try {
        if (!req.body) {
            res.status(400).json("Informe email e senha no corpo da requisição").end()
            return
        }

        const { email, senha } = req.body

        if (email == undefined || senha == undefined) {
            res.status(400).json("Informe email e senha").end()
            return
        }

        const sql = 'SELECT id, nome, email FROM usuario WHERE email = ? AND senha = PASSWORD(?);'

        con.query(sql, [email, senha], (err, results) => {
            if (err) {
                console.error(err)
                res.status(500).json({ erro: 'Erro ao realizar login' })
            } else {
                if (results.length == 0) {
                    res.status(401).json("Acesso negado, credenciais inválidas")
                } else {
                    res.json({
                        mensagem: 'Login realizado com sucesso',
                        usuario: results[0]
                    })
                }
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ erro: 'Erro ao conectar com o banco de dados' })
    }
}

const cadastrar = (req, res) => {
    try {
        if (!req.body) {
            res.status(400).json("Informe nome, email e senha").end()
            return
        }

        const { nome, email, senha } = req.body

        if (!nome || !email || !senha) {
            res.status(400).json({
                erro: 'Informe nome, email e senha'
            }).end()
            return
        }

        const sql = 'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, PASSWORD(?));'

        con.query(sql, [nome, email, senha], (err, results) => {
            if (err) {
                console.error(err)
                res.status(500).json({ erro: 'Erro ao cadastrar usuário' })
            } else {
                const novoUsuario = {
                    id: results.insertId,
                    nome,
                    email
                }

                res.status(201).json({
                    message: 'Usuário cadastrado com sucesso',
                    user: novoUsuario
                })
            }
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({
            erro: 'Erro ao cadastrar usuário',
            details: 'Informe { nome, email, senha }'
        })
    }
}

const listar = (req, res) => {
    const sql = 'SELECT id, nome, email FROM usuario;'

    con.query(sql, (err, results) => {
        if (err) {
            console.error(err)
            res.status(500).json({ erro: 'Erro ao buscar usuários' })
        } else {
            res.json(results)
        }
    })
}

const alterar = (req, res) => {
    try {
        const { nome, email, senha } = req.body
        const id = Number(req.params.id)

        if (!nome || !email || !senha) {
            res.status(400).json({
                erro: 'Informe nome, email e senha'
            }).end()
            return
        }

        const sql = 'UPDATE usuario SET nome = ?, email = ?, senha = PASSWORD(?) WHERE id = ?;'

        con.query(sql, [nome, email, senha, id], (err, results) => {
            if (err) {
                console.error(err)
                res.status(500).json({ erro: 'Erro ao alterar usuário' })
            } else {
                if (results.affectedRows == 0) {
                    res.status(404).json({ erro: 'Usuário não encontrado' })
                } else {
                    const usuarioAtualizado = {
                        id,
                        nome,
                        email
                    }

                    res.status(200).json({
                        message: 'Usuário alterado com sucesso',
                        user: usuarioAtualizado
                    })
                }
            }
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({
            erro: 'Erro ao alterar usuário',
            details: 'Informe { nome, email, senha }'
        })
    }
}

const excluir = (req, res) => {
    const id = Number(req.params.id)

    const sql = 'DELETE FROM usuario WHERE id = ?;'

    con.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err)
            res.status(500).json({
                erro: 'Erro ao excluir usuário',
                msg: err.sqlMessage
            })
        } else {
            if (results.affectedRows == 1) {
                res.json("Registro excluído com sucesso")
            } else {
                res.status(404).json({
                    msg: "Usuário não encontrado",
                    erro: results
                })
            }
        }
    })
}

module.exports = {
    login,
    cadastrar,
    listar,
    alterar,
    excluir
}
