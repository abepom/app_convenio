require("./utils/globals");

const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const associacao = require("./database/associacao");
const cartaoBeneficio = require("./database/cartaoBeneficio");

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);
app.listen(3333);

global.associacao = associacao;
global.cartaoBeneficio = cartaoBeneficio;
