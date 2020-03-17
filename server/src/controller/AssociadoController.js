require("../functions/replaceAll");
module.exports = {
  show(request, response, next) {
    const { cartao } = request.query;
    global.associacao
      .query(
        `SELECT A_associa.Matricula,A_associa.Cd_dependente as titular, A_associa.Cd_tipo_socio, A_depend.cartao_enviado,A_depend.Inativo, A_depend.Cartao_Recebido, A_depend.[Nome do dependente] as dep, A_associa.Nome, A_depend.Nr_Cartao_Abepom, A_depend.Cd_dependente, A_tabela_de_dependentes.Descrição as descricao 
        FROM A_associa 
        INNER JOIN A_depend ON A_associa.Matricula = A_depend.Matricula 
        INNER JOIN A_tabela_de_dependentes ON A_depend.Cd_dependente = A_tabela_de_dependentes.Cd_dependente 
        WHERE (A_depend.Nr_Cartao_Abepom = '${cartao}')`
      )
      .then(([[results]]) => {
        response.json({ socio: results, erro: false });
        next();
      })
      .catch(e => {
        console.log(e);
        return response.json(e);
      });
  },

  log(req, res) {
    let { cartao, id_gds } = req.query;
    global.cartaoBeneficios.query(
      `INSERT INTO conveniados_log_consultas
            (id_gds, Nr_Cartao_Abepom, CIU_data)
        VALUES (${id_gds},'${cartao}',getdate())`
    );
  },
  Informe(req, res, next) {
    let { cartao, id_gds, valor } = req.body;
    valor = valor
      .replace("R$", "")
      .replaceAll(".", "")
      .replace(",", ".");

    global.cartaoBeneficios
      .query(
        `iNSERT INTO conveniados_informe_utilizacao( id_gds, Nr_Cartao_Abepom, CUI_Valor, CIU_data)
     
        VALUES (${id_gds},'${cartao}',${valor},getdate())`
      )
      .then(dados => {
        res.json({ erro: false });
      })
      .catch(() => res.json({ erro: true }));
  },
  getDependentes(req, res) {
    const { matricula } = req.query;
    global.associacao
      .query(
        `
    SELECT A_depend.Cont_dependente, A_depend.[Nome do dependente], A_associa.Cd_dependente, A_depend.Cartao_Recebido, A_depend.cartao_enviado
    FROM A_depend INNER JOIN A_associa ON A_depend.Matricula = A_associa.Matricula AND A_depend.Cont_dependente = A_associa.Cd_dependente
    WHERE (A_depend.Matricula = ${matricula}) AND (A_depend.Inativo = 0) AND (A_associa.Ativo = 1) AND (A_depend.Cartao_Recebido <> 1) AND (A_depend.cartao_enviado <> 1)`
      )
      .then(([results]) => {
        if (results.lenght >= 1) {
          global.associacao
            .query(
              `SELECT A_depend.Cont_dependente, A_depend.[Nome do dependente], A_tabela_de_dependentes.Descrição
        FROM A_depend INNER JOIN A_associa ON A_depend.Matricula = A_associa.Matricula INNER JOIN
        A_tabela_de_dependentes ON A_depend.Cd_dependente = A_tabela_de_dependentes.Cd_dependente
        WHERE (A_depend.Matricula = ${matricula}) AND (A_depend.Inativo = 0) AND (A_associa.Ativo = 1)`
            )
            .then(([results]) => {
              if (results) {
                return res.json({ dependentes: results, erro: false });
              } else {
                return res.json({
                  mensagem: "Associado não esta ativo ou não existe",
                  erro: true
                });
              }
            })
            .catch(e => {
              console.log(e);
              return res.json(e);
            });
        } else {
          return res.json({ erro: true, mensagem: "Associado possui cartão" });
        }
      });

    //return res.json({ matricula });
  }
};
