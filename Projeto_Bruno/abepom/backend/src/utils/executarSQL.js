const sql = require("mssql");
const conexao =
	"Server=192.168.1.34;Database=associacao;User Id=sa;Password=abepom;";

module.exports = function executarSQL(querySql, response) {
	return sql
		.connect(conexao)
		.then(conn => {
			conn
				.request()
				.query(querySql)
				.then(result => response.json(result.recordset))
				.catch(err => response.json(err));
		})
		.catch(err => console.log(err));
};
