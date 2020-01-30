const { Router } = require("express");
const routes = Router();

const associadoController = require("./controller/AssociadoController");
const LoginController = require("./controller/LoginController");

routes.get("/VerificarCartao", associadoController.show);
routes.post("/Login", LoginController.show);
routes.get("/", associadoController.teste);

module.exports = routes;
