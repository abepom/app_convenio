const removeNull = require("../functions/removeNull");
const LoginController = require("./LoginController");

module.exports = {
  async update(req, res) {
    convenio = removeNull(req.body);

    const {
      id_parceiro,
      nome_de_exibicao,
      email,
      telefone_comercial,
      telefone_contato,
      representante,
      cargo_representante,
      site,
      whatsapp
    } = convenio;

    global.cartaoBeneficios
      .query(
        `UPDATE conveniados_pre_cadastro
      SET nome_de_exibicao ='${nome_de_exibicao}', email ='${email}', telefone_comercial ='${telefone_comercial}', telefone_contato ='${telefone_contato}',
       representante ='${representante}', cargo_representante ='${cargo_representante}', site ='${site}', whatsapp ='${whatsapp}'
      WHERE (id_cpc = '${id_parceiro}')`
      )
      .then(() => {
        //return res.json(resp);
        return LoginController.show(
          {
            body: {
              usuario: convenio.cnpj ? convenio.cnpj : convenio.cpf,
              senha: convenio.senha
            }
          },
          res
        );
      })
      .catch(e => {
        return res.json(e);
      });
  },
  async CarregarVendas(req, res) {
    const { id_cpc, mes, ano } = req.query;
    global.cartaoBeneficios
      .query(
        `SELECT conveniados_informe_utilizacao.CIU_id_informe, conveniados_informe_utilizacao.Nr_Cartao_Abepom,
       conveniados_informe_utilizacao.CUI_Valor, associacao.dbo.A_depend.[Nome do dependente]
       FROM conveniados_informe_utilizacao INNER JOIN associacao.dbo.A_depend ON 
       SUBSTRING(conveniados_informe_utilizacao.Nr_Cartao_Abepom, 1, 6) = associacao.dbo.A_depend.Matricula 
       AND SUBSTRING(conveniados_informe_utilizacao.Nr_Cartao_Abepom, 8, 2) = associacao.dbo.A_depend.Cont_dependente 
      WHERE (conveniados_informe_utilizacao.id_gds = ${id_cpc}) AND (MONTH(conveniados_informe_utilizacao.CIU_data) = ${mes}) 
      AND (YEAR(conveniados_informe_utilizacao.CIU_data) = ${ano})`
      )
      .then(([props]) => {
        return res.json(props);
      })
      .catch(e => {
        return res.json(e);
      });
  }
};
