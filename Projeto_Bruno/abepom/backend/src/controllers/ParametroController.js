module.exports = {
	async variaveisParcelamento(request, response) {
		global.associacao
			.query(
				`SELECT B_tarifa_emprestimo AS indice, Valor_minimo_desconto AS valorMinimo, P_taxajuro_odonto AS taxa FROM A_parametro`
			)
			.then(([[resultado]]) => {
				return response.json(resultado);
			})
			.catch(e => {
				return response.json(e);
			});
	},
	async mesAnoParametro(request, response) {
		global.associacao
			.query(`SELECT O_mes_e_ano AS mesAno FROM A_parametro`)
			.then(([[resultado]]) => {
				return response.send(resultado.mesAno);
			})
			.catch(e => {
				return response.json(e);
			});
	}
};
