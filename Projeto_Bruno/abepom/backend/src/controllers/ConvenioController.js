module.exports = {
	async listarConvenios(request, response) {
		const { latitude, longitude, area } = request.query;

		global.associacao
			.query(
				`EXECUTE SP_MOBILE_CONVENIOS_LISTAR_MAPA '${latitude}','${longitude}','${area}'`
			)
			.then(([resultado]) => {
				return response.json(resultado);
			})
			.catch(e => {
				return response.json(e);
			});
	},
	async enderecosConvenio(request, response) {
		const { id_gds } = request.query;

		global.associacao
			.query(`EXECUTE SP_MOBILE_CONVENIOS_LISTAR_ENDERECOS ${id_gds}`)
			.then(([resultado]) => {
				return response.json(resultado);
			})
			.catch(e => {
				return response.json(e);
			});
	},
	async dadosConvenio(request, response) {
		const { id_gds } = request.query;

		global.associacao
			.query(`EXECUTE SP_MOBILE_CONVENIOS_DADOS_GERAIS ${id_gds}`)
			.then(([[resultado]]) => {
				const { palavras, areas } = resultado;

				palavras
					? palavras.includes(",")
						? (arrayPalavras = palavras.split(","))
						: (arrayPalavras = palavras)
					: (arrayPalavras = null);

				areas
					? areas.includes(",")
						? (arrayAreas = areas.split(","))
						: (arrayAreas = areas)
					: (arrayAreas = null);

				return response.json({
					...resultado,
					palavras: arrayPalavras,
					areas: arrayAreas
				});
			})
			.catch(e => {
				return response.json(e);
			});
	},
	async cadastrarSugestao(request, response) {
		const {
			cartao,
			nome,
			responsavel,
			telefone,
			celular,
			cidade,
			area,
			outraArea,
			descricao
		} = request.body;

		console.log(request.body);

		global.associacao
			.query(
				`SP_MOBILE_CONVENIOS_CADASTRAR_SUGESTAO '${cartao}', '${nome}', '${area}', '${outraArea}', 
				'${responsavel}', '${telefone}', '${celular}', '${cidade}','${descricao}'`
			)
			.then(([[resultado]]) => {
				return response.json(resultado);
			})
			.catch(e => {
				console.log;
				return response.json(e);
			});
	},
	async carregarSugestoes(request, response) {
		const { cartao } = request.query;

		global.associacao
			.query(`EXECUTE SP_MOBILE_CONVENIOS_LISTAR_SUGESTOES '${cartao}'`)
			.then(([resultado]) => {
				return response.json(resultado);
			})
			.catch(e => {
				return response.json(e);
			});
	}
};
