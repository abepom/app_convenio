module.exports = {
  async show(req, res) {
    //console.log(req);
    const { usuario, senha } = req.body;

    global.cartaoBeneficios
      .query(
        `SELECT  id_cpc as id_parceiro, razao_social, nome_fantasia, caminho_logomarca, email, telefone_comercial, telefone_contato, cnpj, cpf, ativo, inscricao_estadual_municipal, representante, cargo_representante, facebook, instagram, linkedin, twitter, site, whatsapp, desconto, replace(descricao_desconto,char(13),' ') as descricao_desconto, email_validado, senha, primeiro_acesso, analise_status, Tipo_convenio, data_cadastro, Cd_convênio, cod_parceiro 
        FROM conveniados_pre_cadastro
        where (ativo = '1') 
        ${
          usuario.length > 14 ? " and (cnpj = '" : " and (cpf = '"
        }${usuario}') AND (senha = '${senha}')`
      )
      .then(([[results]]) => {
        if (results) {
          return res.json({ convenio: results, erro: false });
        } else {
          return res.json({
            convenio: results,
            erro: true,
            mensagem: "Usuario não foi encontrado"
          });
        }
      })
      .catch(e => {
        return res.json(e);
      });
  }
};
