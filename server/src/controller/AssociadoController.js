module.exports = {
  async show(request, response) {
    const { matricula } = request.query;
    global.associacao
      .query(
        `SELECT        Matricula, Dig, Nome, Dia_aniv, Mes_aniv, Ano_aniv, Cargo, Cd_tratamento, Cd_tipo_socio, Sexo, Endereco, Complement, Bairro, Cd_cidade, Cep, Fone_residencial, Celular, CPF, REG, Naturalidade, Conjuge, Dia_aniv_e, 
        Mes_aniv_e, Ano_nasc_e, [Cd_local de trabalho], Cd_função, Data_admissão, Data_saida, Agencia, Conta_corrente, [Cd_forma de desconto], [Recadastrado em], Recadastrado, Estornado, Mesano, Foto, Ativo, [E-mail], 
        [Total parcelado], Observacao_da_central, Valor_odontologia, Valor_de_estornos, Observacao_associado, Senha_internet, Dica_senha_internet, Data_atualização, Cd_orgao_receb, Cod_banco, Cidade, Cd_tipo_socio_t, 
        Fone_trabalho, Nr_cartao, Dv_conta, Valor_de_mensalidade, numero, Cod_mensalidade, Categoria_social, Matricula_indicador, Tipo_cobranca, Cd_dependente, Data_inclusao_orgao, Indica_ass_especial, 
        Possui_autorizacao_deb, Valor_margem, Cd_cod_banco, Dt_atualizacao_contato, Possui_portabilidade
        FROM            A_associa
        WHERE        (Matricula = '${matricula}')`
      )
      .then(([results]) => {
        return response.json(results);
      })
      .catch(e => {
        return response.json(e);
      });
  }
};

/*Exemplo da query
[
  {
    "Matricula": "478201",
    "Dig": "0",
    "Nome": "THIAGO DENIR RAMOS",
    "Dia_aniv": "12",
    "Mes_aniv": "05",
    "Ano_aniv": "1988",
    "Cargo": "1",
    "Cd_tratamento": "",
    "Cd_tipo_socio": "01",
    "Sexo": "Masculino",
    "Endereco": "R VALDEMAR TOMAZ RAMOS",
    "Complement": "CASA FUNDOS",
    "Bairro": "BARRA DA LAGOA",
    "Cd_cidade": "0001",
    "Cep": "88061-385",
    "Fone_residencial": "(48)3232-3777",
    "Celular": "(48)99929-1440",
    "CPF": "06257914957",
    "REG": "51006022",
    "Naturalidade": "",
    "Conjuge": "",
    "Dia_aniv_e": "",
    "Mes_aniv_e": "",
    "Ano_nasc_e": "",
    "Cd_local de trabalho": "0099999999",
    "Cd_função": "999",
    "Data_admissão": "2018-10-24T00:00:00.000Z",
    "Data_saida": null,
    "Agencia": "001651",
    "Conta_corrente": "01000280",
    "Cd_forma de desconto": "0003",
    "Recadastrado em": "2019-07-03T00:00:00.000Z",
    "Recadastrado": true,
    "Estornado": false,
    "Mesano": "",
    "Foto": null,
    "Ativo": true,
    "E-mail": "thiago.denir.ramos@hotmail.com",
    "Total parcelado": 0,
    "Observacao_da_central": "",
    "Valor_odontologia": 0,
    "Valor_de_estornos": 0,
    "Observacao_associado": "INCLUIDO EM 03/07/2018 - LOCAL: SEDE ABEPOM - Cargo: Programador\r\nINCLUIDO EM 18/05/2018 -  LOCAL: ABEPOM SEDE - Cargo: Estagiário;, Endereço atualizado em 03/07/2019",
    "Senha_internet": "443163",
    "Dica_senha_internet": "",
    "Data_atualização": "2019-07-03T00:00:00.000Z",
    "Cd_orgao_receb": "0001",
    "Cod_banco": "033",
    "Cidade": "",
    "Cd_tipo_socio_t": "",
    "Fone_trabalho": "",
    "Nr_cartao": "0000000000000",
    "Dv_conta": "2",
    "Valor_de_mensalidade": 0,
    "numero": "40        ",
    "Cod_mensalidade": "",
    "Categoria_social": "             ",
    "Matricula_indicador": "",
    "Tipo_cobranca": 0,
    "Cd_dependente": "00",
    "Data_inclusao_orgao": null,
    "Indica_ass_especial": false,
    "Possui_autorizacao_deb": false,
    "Valor_margem": 40.74,
    "Cd_cod_banco": "",
    "Dt_atualizacao_contato": "2019-11-14T14:10:12.000Z",
    "Possui_portabilidade": false
  }
]*/
