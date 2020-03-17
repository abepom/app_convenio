module.exports = {
	async listarBeneficios(request, response) {
		global.associacao
			.query(
				`SELECT titulo, descricao_formatada AS descricao FROM Mobile_beneficios_e_servicos`
			)
			.then(([resultado]) => {
				return response.json(resultado);
			})
			.catch(e => {
				return response.json(e);
			});
	}
};
