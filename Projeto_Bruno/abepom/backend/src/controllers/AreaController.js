module.exports = {
	async listarAreas(request, response) {
		global.associacao
			.query(`EXECUTE SP_MOBILE_AREAS_LISTAR`)
			.then(([resultado]) => {
				return response.json(resultado);
			})
			.catch(e => {
				return response.json(e);
			});
	}
};
