const express = require("express")
const router = express.Router()

const usuario = require("./controllers/usuario")
const ocorrencia = require("./controllers/ocorrencia")

const rotaInicial = (req, res) => {
    res.json("Back-end de resíduos respondendo")
}

router.get("/", rotaInicial)
router.post("/usuarios", usuario.cadastrar)
router.get("/usuarios", usuario.listar)
router.put("/usuarios/:id", usuario.alterar)
router.delete("/usuarios/:id", usuario.excluir)
router.post("/login", usuario.login)

router.post("/ocorrencias", ocorrencia.cadastrar)
router.get("/ocorrencias", ocorrencia.listar)
router.put("/ocorrencias/:id", ocorrencia.alterar)
router.delete("/ocorrencias/:id", ocorrencia.excluir)

router.get("/resumo", ocorrencia.resumo)

module.exports = router
