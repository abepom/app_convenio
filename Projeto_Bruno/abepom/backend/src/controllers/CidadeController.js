module.exports = {
	listarCidades(request, response) {
		global.associacao
			.query(
				`SELECT cd_cidade AS codigo, nm_cidade AS nome FROM A_cidades ORDER BY Nm_cidade`
			)
			.then(([resultado]) => {
				return response.json(resultado);
			})
			.catch(e => {
				return response.json(e);
			});
	},
	listarCidadesPorArea(request, response) {
		const { area } = request.query;

		global.associacao
			.query(`EXECUTE SP_MOBILE_CONVENIOS_CIDADES_LISTAR '${area}'`)
			.then(([resultado]) => {
				return response.json(resultado);
			})
			.catch(e => {
				return response.json(e);
			});
	}
};
