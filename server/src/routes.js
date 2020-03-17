const { Router } = require("express");
const routes = Router();

const associadoController = require("./controller/AssociadoController");
const LoginController = require("./controller/LoginController");
const ParceirosController = require("./controller/ParceirosController");
const CidadesController = require("./controller/CidadesController");
const EnderecoController = require("./controller/EnderecoController");
const VendaController = require("./controller/VendaController");
//teste
const enviarEmail = require("./functions/EnviarEmail");

//Associado

routes.get("/VerificarCartao", associadoController.show);
routes.get("/VerificarCartao", associadoController.log);
routes.get("/Dependentes", associadoController.getDependentes);

//Informe de utilização

routes.post("/Informe", associadoController.Informe);
routes.get("/ListaAtendimentos", ParceirosController.CarregarVendas);

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

//validar Cartao
routes.post("/ConsultarCartao", VendaController.ConsultarCartao);

//EFETUAR VENDAS
routes.post("/efetuarVendas", VendaController.ConsultarPermissao);
//routes.post("/efetuarVendas", VendaController.ConsultarLimite);
routes.post("/efetuarVendas", VendaController.Venda);

//teste
routes.get("/", (req, res, next) => {
  //console.log("req", req);
  //console.log("res", res);
  //console.log("next", next);
  req.dados = { ...req.body, add: "sim" };

  next();
});
routes.get("/teste", (req, res, next) => {
  return res.send("ok");
});
routes.use((req, res, next) => {
  console.log(req.log);
  next();
});
routes.get("/", (req, res) => {
  console.log("req", req.dados);
  return res.json(req.dados);
});

module.exports = routes;
