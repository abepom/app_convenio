require("./variaveisAmbiente");
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const app = express();
const associacao = require("./database/associacao");

app.use(cors());
app.use(express.json());
app.use(routes);
app.listen(3333);

global.associacao = associacao;
