const Sequelize = require("sequelize");

associacao = new Sequelize("associacao", global.userName, global.password, {
	dialect: "mssql",
	host: global.hostName,
	port: global.port,
	logging: false,
	dialectOptions: {
		requestTimeout: 60000
	}
});

module.exports = associacao;
