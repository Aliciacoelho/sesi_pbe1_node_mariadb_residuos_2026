const con = require('../db')


const cadastrar = (req, res) => {
    try {
        if (!req.body) {
            res.status(400).json("Informe os dados da ocorrência").end()
            return
        }

        const {
            usuarioId,
            local,
            tipoResiduo,
            nivelRisco,
            status
        } = req.body

        if (usuarioId == undefined || !local || !tipoResiduo) {
            res.status(400).json({
                erro: 'Informe usuarioId, local e tipoResiduo'
            }).end()
            return
        }

        const sql = `
            INSERT INTO ocorrencia
            (usuarioId, local, tipoResiduo, nivelRisco, status)
            VALUES (?, ?, ?, ?, ?);
        `

        con.query(
            sql,
            [
                usuarioId,
                local,
                tipoResiduo,
                nivelRisco || 'Medio',
                status || 'Novo'
            ],
            (err, results) => {
                if (err) {
                    console.error(err)
                    res.status(500).json({
                        erro: 'Erro ao cadastrar ocorrência'
                    })
                } else {
                    const novaOcorrencia = {
                        id: results.insertId,
                        usuarioId,
                        local,
                        tipoResiduo,
                        nivelRisco: nivelRisco || 'Medio',
                        status: status || 'Novo'
                    }

                    res.status(201).json({
                        message: 'Ocorrência cadastrada com sucesso',
                        ocorrencia: novaOcorrencia
                    })
                }
            }
        )
    } catch (error) {
        console.error(error)
        res.status(500).json({
            erro: 'Erro ao cadastrar ocorrência'
        })
    }
}

const listar = (req, res) => {
    const sql = `
        SELECT
            ocorrencia.id,
            ocorrencia.usuarioId,
            usuario.nome AS nomeUsuario,
            ocorrencia.local,
            ocorrencia.tipoResiduo,
            ocorrencia.nivelRisco,
            ocorrencia.data,
            ocorrencia.status
        FROM ocorrencia
        INNER JOIN usuario
        ON usuario.id = ocorrencia.usuarioId;
    `

    con.query(sql, (err, results) => {
        if (err) {
            console.error(err)
            res.status(500).json({
                erro: 'Erro ao buscar ocorrências'
            })
        } else {
            res.json(results)
        }
    })
}

// ALTERAR OCORRENCIA
const alterar = (req, res) => {
    try {
        const id = Number(req.params.id)

        const {
            usuarioId,
            local,
            tipoResiduo,
            nivelRisco,
            data,
            status
        } = req.body

        if (
            usuarioId == undefined ||
            !local ||
            !tipoResiduo ||
            !nivelRisco ||
            !data ||
            !status
        ) {
            res.status(400).json({
                erro: 'Informe usuarioId, local, tipoResiduo, nivelRisco, data e status'
            }).end()
            return
        }

        const sql = `
            UPDATE ocorrencia
            SET usuarioId = ?,
                local = ?,
                tipoResiduo = ?,
                nivelRisco = ?,
                data = ?,
                status = ?
            WHERE id = ?;
        `

        con.query(
            sql,
            [
                usuarioId,
                local,
                tipoResiduo,
                nivelRisco,
                data,
                status,
                id
            ],
            (err, results) => {
                if (err) {
                    console.error(err)
                    res.status(500).json({
                        erro: 'Erro ao alterar ocorrência'
                    })
                } else {
                    if (results.affectedRows == 0) {
                        res.status(404).json({
                            erro: 'Ocorrência não encontrada'
                        })
                    } else {
                        const ocorrenciaAtualizada = {
                            id,
                            usuarioId,
                            local,
                            tipoResiduo,
                            nivelRisco,
                            data,
                            status
                        }

                        res.status(200).json({
                            message: 'Ocorrência alterada com sucesso',
                            ocorrencia: ocorrenciaAtualizada
                        })
                    }
                }
            }
        )
    } catch (error) {
        console.error(error)
        res.status(400).json({
            erro: 'Erro ao alterar ocorrência'
        })
    }
}

const excluir = (req, res) => {
    const id = Number(req.params.id)

    const sql = 'DELETE FROM ocorrencia WHERE id = ?;'

    con.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err)
            res.status(500).json({
                erro: 'Erro ao excluir ocorrência',
                msg: err.sqlMessage
            })
        } else {
            if (results.affectedRows == 1) {
                res.json('Ocorrência excluída com sucesso')
            } else {
                res.status(404).json({
                    erro: 'Ocorrência não encontrada'
                })
            }
        }
    })
}


const resumo = (req, res) => {
    const sql = `
        SELECT COUNT(*) AS totalTratados
        FROM ocorrencia
        WHERE status = 'Tratado';
    `

    con.query(sql, (err, results) => {
        if (err) {
            console.error(err)
            res.status(500).json({
                erro: 'Erro ao gerar resumo'
            })
        } else {
            res.json(results[0])
        }
    })
}

module.exports = {
    cadastrar,
    listar,
    alterar,
    excluir,
    resumo
}
