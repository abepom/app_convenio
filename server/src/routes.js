const { Router } = require("express");
const routes = Router();

const associadoController = require("./controller/AssociadoController");

routes.get("/", associadoController.show);

module.exports = routes;
