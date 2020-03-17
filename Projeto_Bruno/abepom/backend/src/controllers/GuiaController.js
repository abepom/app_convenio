module.exports = {
	listarGrupos(request, response) {
		global.associacao
			.query(`SP_MOBILE_GUIA_LISTAR_GRUPOS`)
			.then(([resultado]) => {
				return response.json(resultado);
			})
			.catch(e => {
				return response.json(e);
			});
	},
	listarSubgrupos(request, response) {
		const { id_grupo, nivel } = request.query;

		global.associacao
			.query(`SP_MOBILE_GUIA_LISTAR_SUBGRUPOS '${id_grupo}','${nivel}'`)
			.then(([resultado]) => {
				return response.json(resultado);
			})
			.catch(e => {
				return response.json(e);
			});
	},
	listarAreasDoGrupo(request, response) {
		const { grupo } = request.query;

		global.associacao
			.query(`SP_MOBILE_GUIA_LISTAR_AREAS_GRUPO '${grupo}'`)
			.then(([resultado]) => {
				return response.json(resultado);
			})
			.catch(e => {
				return response.json(e);
			});
	},
	listarConvenios(request, response) {
		const { area, pagina } = request.query;

		global.associacao
			.query(`SP_MOBILE_GUIA_LISTAR_CONVENIOS '${area}','${pagina}'`)
			.then(([resultado]) => {
				return response.json(resultado);
			})
			.catch(e => {
				return response.json(e);
			});
	},
	buscaLivre(request, response) {
		const { busca, cidade, pagina } = request.query;

		global.associacao
			.query(`SP_MOBILE_GUIA_BUSCA_LIVRE '${busca}','${cidade}','${pagina}'`)
			.then(([resultado]) => {
				return response.json(resultado);
			})
			.catch(e => {
				return response.json(e);
			});
	}
};
