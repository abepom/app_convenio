//retorna todos os endereços do Parceiro
module.exports = {
  async getEndereco(req, res) {
    const { id_parceiro } = req.query;

    global.cartaoBeneficios
      .query(
        `SELECT conveniados_pre_cadastro_endereco.id_cpc_endereco, conveniados_pre_cadastro_endereco.cep, conveniados_pre_cadastro_endereco.logradouro, conveniados_pre_cadastro_endereco.endereco, 
        conveniados_pre_cadastro_endereco.numero, conveniados_pre_cadastro_endereco.complemento, conveniados_pre_cadastro_endereco.bairro, conveniados_pre_cadastro_endereco.cd_cidade, 
        conveniados_pre_cadastro_endereco.telefone, conveniados_pre_cadastro_endereco.telefone_2, associacao.dbo.A_cidades.Nm_cidade ,associacao.dbo.A_cidades.UF
        FROM conveniados_pre_cadastro_endereco INNER JOIN
        associacao.dbo.A_cidades ON conveniados_pre_cadastro_endereco.cd_cidade = associacao.dbo.A_cidades.Cd_cidade
        WHERE (conveniados_pre_cadastro_endereco.id_cpc = ${id_parceiro})`
      )
      .then(([results]) => {
        return res.json(results);
      })
      .catch(e => {
        return res.json(e);
      });
  },
  //Grava o nomo endereço cadastrado
  async setEndereco(req, res) {
    const {
      logradouro,
      numero,
      cidade,
      bairro,
      uf,
      fone,
      cep,
      complemento
    } = req.body;

    let endereco = logradouro.split(" ");
    let prefix = endereco.shift();
    let sufix = endereco.toString().replace(",", " ");

    const { id } = req.params;
    global.cartaoBeneficios
      .query(
        `INSERT INTO conveniados_pre_cadastro_endereco
        (id_cpc, cep, logradouro, endereco, numero, complemento, bairro, cd_cidade, telefone)
        VALUES(${id},${cep},${prefix},${sufix},${numero},${icomplementod},${bairro},${cidade},${fone})`
      )
      .then(([results]) => {
        return res.json(results);
      })
      .catch(e => {
        return res.json(e);
      });
    return res.json({ ...req.body });
  },
  //Edita um endereço cadastrado
  async editEndereco(req, res) {
    const { logradouro, numero, cidade, bairro, uf, fone, cep } = req.body;
    const { id } = req.params;
    return res.json({ ...req.body, id });
  },
  //Remove um endereço cadastrado
  async removeEndereco(req, res) {
    const { logradouro, numero, cidade, bairro, uf, fone, cep } = req.body;
    const { id } = req.params;
    return res.json({ ...req.body, id });
  }
};
