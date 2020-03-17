module.exports = {
	async listarHistoricoNotificacoes(request, response) {
		const { cartao } = request.query;

		global.associacao
			.query(`EXECUTE SP_MOBILE_NOTIFICACOES_HISTORICO '${cartao}'`)
			.then(([resultado]) => {
				return response.json(resultado);
			})
			.catch(e => {
				return response.json(e);
			});
	}
};
