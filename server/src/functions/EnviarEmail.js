const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "thiago.ramos@abepom.org.br",
    pass: "Bone1234"
  },
  tls: { rejectUnauthorized: false }
});

mailOptinons = {
  from: "thiago.ramos@abepom.org.br",
  to: "nti@abepom.org.br",
  subject: "Teste de envio de email com nodeJS",
  text: "Esse e o corpo do email",
  html: `ola mundo
      <h1>texte de html</h1>
      <p>outro texte</p>`
};
const enviarEmail = () => {
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email enviado: " + info.response);
    }
  });
};
module.export = enviarEmail;
