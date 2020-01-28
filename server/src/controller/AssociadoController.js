module.exports = {
  async show(request, response) {
    const { cartao } = request.query;
    global.associacao
      .query(
        `SELECT A_associa.Matricula, A_associa.Cd_tipo_socio, A_depend.cartao_enviado, A_depend.Cartao_Recebido, A_depend.[Nome do dependente] as dep, A_associa.Nome, A_depend.Nr_Cartao_Abepom, A_depend.Cd_dependente, A_tabela_de_dependentes.Descrição as descricao 
        FROM A_associa 
        INNER JOIN A_depend ON A_associa.Matricula = A_depend.Matricula 
        INNER JOIN A_tabela_de_dependentes ON A_depend.Cd_dependente = A_tabela_de_dependentes.Cd_dependente 
        WHERE (A_depend.Inativo = 0) AND (A_depend.Nr_Cartao_Abepom = '${cartao}')`
      )
      .then(([[results]]) => {
        return response.json({ socio: results, erro: false });
      })
      .catch(e => {
        console.log(e);
        return response.json(e);
      });
  }
};
