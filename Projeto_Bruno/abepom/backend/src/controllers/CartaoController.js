module.exports = {
	validarCartao(request, response) {
		const { bloquear, cartao, dependente } = request.body;

		global.associacao
			.query(
				`UPDATE A_depend SET Cartao_recebido = 1, Dt_cartao_recebido = GETDATE(), Sol_cartao = 0, 
                Bloquea_compra = '${bloquear}', 
                Obs = 'Cartão validado pelo APP.', dt_solicitacao = '' WHERE matricula = 
                SUBSTRING('${cartao}',1,6) AND cont_dependente = '${dependente}'`
			)
			.then(([resultado]) => {
				return response.json(resultado);
			})
			.catch(e => {
				return response.json(e);
			});
	},
	solicitarCartao(request, response) {
		const { cartao, dependente } = request.body;

		global.associacao
			.query(
				`UPDATE A_depend SET Sol_cartao = 1, Obs = 'Cartão solicitado pelo APP.', dt_solicitacao = GETDATE() 
                WHERE matricula = SUBSTRING('${cartao}',1,6) AND cont_dependente = '${dependente}'`
			)
			.then(([resultado]) => {
				return response.json(resultado);
			})
			.catch(e => {
				return response.json(e);
			});
	}
};
