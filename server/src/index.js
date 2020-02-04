const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const app = express();
require("./variaveisAmbiente");
const associacao = require("./database/associacao");
const cartaoBeneficios = require("./database/cartaoBeneficios");

app.use(cors());
app.use(express.json());
app.use(routes);
app.listen(3333);

global.associacao = associacao;
global.cartaoBeneficios = cartaoBeneficios;
