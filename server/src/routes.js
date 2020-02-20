const { Router } = require("express");
const routes = Router();

const associadoController = require("./controller/AssociadoController");
const LoginController = require("./controller/LoginController");
const ParceirosController = require("./controller/ParceirosController");
const CidadesController = require("./controller/CidadesController");
const EnderecoController = require("./controller/EnderecoController");

//teste
const enviarEmail = require("./functions/EnviarEmail");

//Associado
routes.get("/VerificarCartao", associadoController.show);
//Autenticação e dados do usuario
routes.post("/Login", LoginController.showConvenios);
routes.post("/Login", LoginController.showParceiros);

//rota de controle de endereços
routes.get("/enderecos", EnderecoController.getEndereco);
routes.post("/enderecos/:id", EnderecoController.setEndereco);
routes.put("/enderecos/:id", EnderecoController.editEndereco);
routes.delete("/enderecos/:id", EnderecoController.removeEndereco);

//routes.get("/", associadoController.teste);
//Controle do usuario
routes.post("/user/edit", ParceirosController.update);
routes.post("/user/resetPass", LoginController.ResetConvenio);
routes.post("/user/resetPass", LoginController.ResetParceiros);

//mostrar cidades
routes.get("/cidades", CidadesController.index);

//teste
routes.get("/teste/email", (req, res) => enviarEmail);

module.exports = routes;
