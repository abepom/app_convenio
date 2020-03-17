const parseStringAsArray = require("../utils/parseStringAsArray");
const executarSQL = require("../utils/executarSQL");

module.exports = {
	async index(request, response) {
		const { latitude, longitude, techs } = request.query;

		const techsArray = parseStringAsArray(techs);

		const convenios = await executarSQL(
			`SELECT TOP(40) guia_de_servico_enderecos.latitude, guia_de_servico_enderecos.longitude, 
			guia_de_servico.id_gds, guia_de_servico.nome_parceiro, STUFF((SELECT ',' + descricao_area FROM 
			cartao_beneficios.dbo.guia_de_servico_especialidades WHERE tipo_especialidade = 1 AND guia_de_servico_especialidades.id_gds = 
			guia_de_servico.id_gds ORDER BY guia_de_servico_especialidades.descricao_area FOR XML PATH ('')), 1, 1, '') 
			AS areas, STUFF((SELECT ',' + descricao_area FROM cartao_beneficios.dbo.guia_de_servico_especialidades WHERE tipo_especialidade = 2 
			AND guia_de_servico_especialidades.id_gds = guia_de_servico.id_gds ORDER BY guia_de_servico_especialidades.descricao_area 
			FOR XML PATH ('')),1,1,'') AS palavras FROM cartao_beneficios.dbo.guia_de_servico_enderecos INNER JOIN cartao_beneficios.dbo.guia_de_servico ON 
			guia_de_servico_enderecos.id_gds = guia_de_servico.id_gds WHERE (guia_de_servico_enderecos.latitude <> '') AND 
			(guia_de_servico_enderecos.longitude <> '') AND (guia_de_servico.ativo = 1) AND (guia_de_servico_enderecos.cd_cidade = 0001)`,
			response
		);

		return convenios;
	}
};
