const Sequelize = require("sequelize");

cartaoBeneficios = new Sequelize(
  "cartao_beneficios",
  global.userName,
  global.password,
  {
    dialect: "mssql",
    host: global.hostName,
    port: global.port, // Default port
    logging: false,
    // disable logging; default: console.log

    dialectOptions: {
      requestTimeout: 60000 // timeout = 60 seconds
    }
  }
);
// Initialize Sequelize to connect to sample DB
module.exports = cartaoBeneficios;
