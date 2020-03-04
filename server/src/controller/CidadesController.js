module.exports = {
  async index(req, res) {
    global.associacao
      .query(
        `SELECT Cd_cidade, Nm_cidade, Código_local_trabalho
          FROM A_cidades order by Nm_cidade`
      )
      .then(([results]) => {
        if (results) {
          return res.json(results);
        } else {
          return res.json({
            convenio: results
          });
        }
      })
      .catch(e => {
        return res.json(e);
      });
  }
};
