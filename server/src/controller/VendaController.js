module.exports = {
  Venda(req, res, next) {
    const { id_gds, matricula, dep, valor, cupom } = req.body;

    global.associacao
      .query(
        `EXECUTE DBO.SP_LANCARVENDAS_TIPO_5 ${matricula},${dep},${valor},${id_gds},${cupom}`
      )
      .then(([[results]]) => {
        res.json(results);
      })
      .catch(e => {
        console.log(e);
        return res.json(e);
      });
  },
  ConsultarLimite(req, res, next) {
    const { matricula } = req.body;

    global.associacao
      .query(`EXECUTE DBO.SP_CONSULTAR_LIMITES '${matricula}'`)
      .then(([[results]]) => {
        if (results.retorno) {
          return res.json(results);
        } else {
          return res.json(results);
        }

        next();
      })
      .catch(e => {
        console.log(e);
        return res.json(e);
      });
  },
  ConsultarPermissao(req, res, next) {
    const { matricula, dep } = req.body;

    global.associacao
      .query(
        `EXECUTE DBO.SP_CONSULTAR_PERMISSAO '${matricula}','${dep}','0004'`
      )
      .then(([[results]]) => {
        if (results.retorno) {
          next();
        } else {
          return res.json(results);
        }
      })
      .catch(e => {
        console.log(e);
        return res.json(e);
      });
  },
  ConsultarCartao(req, res) {
    const { cartao } = req.body;

    global.associacao
      .query(`EXECUTE DBO.SP_CONSULTAR_CARTAO '${cartao}'`)
      .then(([[results]]) => {
        return res.json(results);
      })
      .catch(e => {
        console.log(e);
        return res.json(e);
      });
  }
};
