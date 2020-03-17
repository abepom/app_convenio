module.exports = {
	consultarLimites(request, response) {
		const { cartao } = request.query;

		global.associacao
			.query(
				`SELECT Valor - Valor_ocupado AS limite, Valor_saude - Valor_ocupado_saude AS limite_saude 
                FROM Co_lanca_conv_limite WHERE matricula = SUBSTRING('${cartao}',1,6) AND 
                Mesano = (SELECT O_mes_e_ano FROM A_parametro)`
			)
			.then(([[resultado]]) => {
				return response.json(resultado);
			})
			.catch(e => {
				return response.json(e);
			});
	},
	descontosFuturos(request, response) {
		const { cartao } = request.query;

		global.associacao
			.query(`EXECUTE SP_MOBILE_DESCONTOS_FUTUROS '${cartao}'`)
			.then(([resultado]) => {
				return response.json(resultado);
			})
			.catch(e => {
				return response.json(e);
			});
	},
	consultarDescontos(request, response) {
		const { cartao, mes, ano } = request.query;

		global.associacao
			.query(
				`EXECUTE SP_MOBILE_CONSULTAR_DESCONTOS '${cartao}','${mes}','${ano}'`
			)
			.then(([resultado]) => {
				return response.json(resultado);
			})
			.catch(e => {
				return response.json(e);
			});
	},
	descontosEspecificos(request, response) {
		const { cartao, mes, ano } = request.query;

		global.associacao
			.query(
				`EXECUTE SP_MOBILE_CONSULTAR_DESCONTOS_ESPECIFICOS '${cartao}','${mes}','${ano}'`
			)
			.then(([resultado]) => {
				return response.json(resultado);
			})
			.catch(e => {
				return response.json(e);
			});
	}
};
