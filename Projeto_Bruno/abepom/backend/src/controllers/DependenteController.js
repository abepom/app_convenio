module.exports = {
	listarDependentes(request, response) {
		const { cartao } = request.query;

		global.associacao
			.query(`EXECUTE SP_MOBILE_DEPENDENTE_LISTAR '${cartao}'`)
			.then(([resultado]) => {
				return response.json(resultado);
			})
			.catch(e => {
				return response.json(e);
			});
	},
	listarAreas(request, response) {
		const { cartao, dependente } = request.query;

		global.associacao
			.query(
				`EXECUTE SP_MOBILE_DEPENDENTE_LISTAR_AREAS '${cartao}','${dependente}'`
			)
			.then(([resultado]) => {
				return response.json(resultado);
			})
			.catch(e => {
				return response.json(e);
			});
	},
	salvarAreas(request, response) {
		const { area, cartao, dependente } = request.body;

		global.associacao
			.query(
				`EXECUTE SP_MOBILE_DEPENDENTE_ALTERAR_AREA '${cartao}','${dependente}','${area.codigo_area}',${area.permitido}`
			)
			.then(([resultado]) => {
				return response.json(resultado);
			})
			.catch(e => {
				return response.json(e);
			});
	},
	alterarTodas(request, response) {
		const { todos, cartao, dependente } = request.body;

		global.associacao
			.query(
				`SP_MOBILE_DEPENDENTE_ALTERAR_TODAS_AREAS ${todos}, '${cartao}','${dependente}'`
			)
			.then(([resultado]) => {
				return response.json(resultado);
			})
			.catch(e => {
				return response.json(e);
			});
	}
};
