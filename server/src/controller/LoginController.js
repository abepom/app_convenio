const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "no-reply@abepom.org.br",
    pass: "abepomsede"
  },
  tls: { rejectUnauthorized: false }
});

module.exports = {
  async showParceiros(req, res) {
    const { usuario, senha } = req.body;

    global.cartaoBeneficios
      .query(
        `SELECT  guia_de_servico.id_gds ,guia_de_servico.nome_parceiro, guia_de_servico.caminho_logomarca, guia_de_servico.cnpj+guia_de_servico.cpf as doc
        FROM conveniados_pre_cadastro INNER JOIN guia_de_servico ON conveniados_pre_cadastro.cod_parceiro = guia_de_servico.cod_parceiro
        WHERE (conveniados_pre_cadastro.ativo = '1') 
        ${
          usuario.length > 14
            ? " and (conveniados_pre_cadastro.cnpj = '"
            : " and (conveniados_pre_cadastro.cpf = '"
        }${usuario}') AND (senha = '${senha}')`
      )
      .then(([[results]]) => {
        if (results) {
          console.log(results);
          return res.json({ ...results, erro: false, efetuarVenda: false });
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
  },
  async showConvenios(req, res, next) {
    const { usuario, senha } = req.body;

    global.cartaoBeneficios
      .query(
        `SELECT guia_de_servico.id_gds, guia_de_servico.nome_parceiro, guia_de_servico.caminho_logomarca, associacao.dbo.A_Convenio_usuarios.usuario
        FROM guia_de_servico INNER JOIN associacao.dbo.A_Convenio_usuarios ON guia_de_servico.cd_convênio = associacao.dbo.A_Convenio_usuarios.cd_convênio
        WHERE 
            (associacao.dbo.A_Convenio_usuarios.cgc = associacao.dbo.FN_FORMATAR_CPFCNPJ('${usuario}')) 
        AND (associacao.dbo.A_Convenio_usuarios.nivel = 1) 
        AND (associacao.dbo.A_Convenio_usuarios.senha = '${senha}') 
        OR  (associacao.dbo.A_Convenio_usuarios.cgc = associacao.dbo.FN_FORMATAR_CPFCNPJ('${usuario}')) 
        AND (associacao.dbo.A_Convenio_usuarios.nivel = 1) 
        AND (associacao.dbo.A_Convenio_usuarios.senha = '${senha}') 
        OR  (associacao.dbo.A_Convenio_usuarios.cgc = associacao.dbo.FN_FORMATAR_CPFCNPJ('${usuario}')) 
        AND (associacao.dbo.A_Convenio_usuarios.nivel = 1)
        AND (associacao.dbo.A_Convenio_usuarios.senha = '${senha}') 
        OR  (associacao.dbo.A_Convenio_usuarios.nivel = 2) 
        AND (associacao.dbo.A_Convenio_usuarios.senha = '${senha}') 
        AND (associacao.dbo.A_Convenio_usuarios.usuario = '${usuario}')
        `
      )
      .then(([[results]]) => {
        if (results) {
          console.log(results);

          return res.json({ ...results, erro: false, efetuarVenda: true });
        } else {
          console.log("results");

          return next();
        }
      })
      .catch(e => {
        return res.json(e);
      });
  },
  async ResetConvenio(req, res, next) {
    const { usuario } = req.body;

    // return res.send("teste");
    global.associacao
      .query(
        `SELECT top(1) A_Convenio_usuarios.email ,  A_convenio.Cd_convênio, A_convenio.Razão_social, A_Convenio_usuarios.senha
        FROM A_Convenio_usuarios INNER JOIN A_convenio ON A_Convenio_usuarios.cd_convênio = A_convenio.Cd_convênio
        WHERE (A_Convenio_usuarios.cgc = dbo.FN_FORMATAR_CPFCNPJ('${usuario}')) AND (A_Convenio_usuarios.nivel = 1) OR
              (A_Convenio_usuarios.cgc = dbo.FN_FORMATAR_CPFCNPJ('${usuario}')) AND (A_Convenio_usuarios.nivel = 1) OR
              (A_Convenio_usuarios.cgc = dbo.FN_FORMATAR_CPFCNPJ('${usuario}')) AND (A_Convenio_usuarios.nivel = 1) OR
              (A_Convenio_usuarios.nivel = 2) AND (A_Convenio_usuarios.usuario = '${usuario}')`
      )
      .then(([[results]]) => {
        if (results) {
          let mailOptinons = {
            from: "No RepLy <no-reply@abepom.org.br>",
            to: "nti@abepom.org.br",
            //to: results.email,
            subject: "CONFIRMAR VALIDAÇÃO DE CADASTRO - ABEPOM",

            html: `Prezado(a), " ${results["Razão_social"]} "<br /><br />
             Sua nova senha gerada foi <b>${results["senha"]}</b>        
             `
          };

          transporter.sendMail(mailOptinons, function(error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email enviado: " + info.response);
            }
          });

          return res.json({ ...results, erro: false });
        } else {
          return next();
        }
      })
      .catch(e => {
        return res.json(e);
      });
  },
  async ResetParceiros(req, res) {
    const { usuario } = req.body;
    global.cartaoBeneficios
      .query(
        `SELECT guia_de_servico.nome_parceiro, guia_de_servico.cpf, guia_de_servico.cnpj, guia_de_servico.email, guia_de_servico.id_gds, guia_de_servico.cod_parceiro, conveniados_pre_cadastro.senha
        FROM guia_de_servico INNER JOIN conveniados_pre_cadastro ON guia_de_servico.cod_parceiro = conveniados_pre_cadastro.cod_parceiro
        WHERE (guia_de_servico.cpf = associacao.dbo.FN_FORMATAR_CPFCNPJ('${usuario}')) OR
              (guia_de_servico.cnpj = associacao.dbo.FN_FORMATAR_CPFCNPJ('${usuario}'))
      `
      )
      .then(([[results]]) => {
        if (results) {
          let mailOptinons = {
            from: "No RepLy <no-reply@abepom.org.br>",
            to: "nti@abepom.org.br",

            //to: results.email,
            subject: "CONFIRMAR VALIDAÇÃO DE CADASTRO - ABEPOM",

            html: `Prezado(a), "${results.nome_parceiro} "<br /><br />
            Você solicitou um resgate de senha do seu cadastro na ABEPOM.<br />
            Sua nova senha de acesso é: <b>${results["senha"]}</b>           
             `
          };

          transporter.sendMail(mailOptinons, function(error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email enviado: " + info);
            }
          });

          return res.json({ ...results, erro: false, efetuarVenda: true });
        } else {
          return res.json({
            erro: true,
            mensagem: "usuario nao foi encontrado"
          });
        }
      })
      .catch(e => {
        return res.json(e);
      });
  }
};
