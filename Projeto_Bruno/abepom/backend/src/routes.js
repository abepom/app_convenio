const { Router } = require("express");
const ConvenioController = require("./controllers/ConvenioController");
const DependenteController = require("./controllers/DependenteController");
const CartaoController = require("./controllers/CartaoController");
const AreaController = require("./controllers/AreaController");
const BeneficioController = require("./controllers/BeneficioController");
const AssociadoController = require("./controllers/AssociadoController");
const NotificacaoController = require("./controllers/NotificacaoController");
const CidadeController = require("./controllers/CidadeController");
const ParametroController = require("./controllers/ParametroController");
const GuiaController = require("./controllers/GuiaController");
const routes = Router();

/* NOVOS */

/* DEPENDENTES */
routes.get("/listarDependentes", DependenteController.listarDependentes);
routes.get("/listarAreasDependentes", DependenteController.listarAreas);
routes.post("/salvarAreas", DependenteController.salvarAreas);
routes.post("/alterarTodas", DependenteController.alterarTodas);

/* CARTÃO */
routes.post("/validarCartao", CartaoController.validarCartao);
routes.post("/solicitarCartao", CartaoController.solicitarCartao);

/* CONVÊNIOS */
routes.get("/listarConvenios", ConvenioController.listarConvenios);
routes.get("/enderecosConvenio", ConvenioController.enderecosConvenio);
routes.get("/dadosConvenio", ConvenioController.dadosConvenio);
routes.post("/cadastrarSugestao", ConvenioController.cadastrarSugestao);
routes.get("/carregarSugestoes", ConvenioController.carregarSugestoes);

/* ÁREAS */
routes.get("/listarAreas", AreaController.listarAreas);

/* BENEFÍCIOS E SERVIÇOS */
routes.get("/listarBeneficios", BeneficioController.listarBeneficios);

/* LIMITES */
routes.get("/consultarLimites", AssociadoController.consultarLimites);

/* DESCONTOS */
routes.get("/descontosFuturos", AssociadoController.descontosFuturos);

/* NOTIFICAÇÕES */
routes.get(
  "/listarHistoricoNotificacoes",
  NotificacaoController.listarHistoricoNotificacoes
);

routes.get("/listarCidades", CidadeController.listarCidades);
routes.get("/listarCidadesPorArea", CidadeController.listarCidadesPorArea);

/* PARÂMETROS */
routes.get("/variaveisParcelamento", ParametroController.variaveisParcelamento);
routes.get("/mesAnoParametro", ParametroController.mesAnoParametro);

/* GUIA ONLINE */
routes.get("/listarGrupos", GuiaController.listarGrupos);
routes.get("/listarSubgrupos", GuiaController.listarSubgrupos);
routes.get("/listarAreasDoGrupo", GuiaController.listarAreasDoGrupo);
routes.get("/listarConveniosGuia", GuiaController.listarConvenios);
routes.get("/buscaLivre", GuiaController.buscaLivre);

/* CONSULTAR DESCONTOS */
routes.get("/consultarDescontos", AssociadoController.consultarDescontos);
routes.get("/descontosEspecificos", AssociadoController.descontosEspecificos);

module.exports = routes;
