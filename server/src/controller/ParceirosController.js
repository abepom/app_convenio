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
  }
};
