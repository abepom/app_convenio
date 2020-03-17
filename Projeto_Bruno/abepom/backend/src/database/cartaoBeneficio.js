const Sequelize = require("sequelize");

cartaoBeneficios = new Sequelize(
	"cartao_beneficios",
	global.userName,
	global.password,
	{
		dialect: "mssql",
		host: global.hostName,
		port: global.port,
		logging: false,

		dialectOptions: {
			requestTimeout: 60000
		}
	}
);
module.exports = cartaoBeneficios;
