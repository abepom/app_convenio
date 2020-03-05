import api from '../api';

export default conectar = async (documento, pass) => {
  console.log(documento.length > 13, pass);
  if (documento.length > 13 && pass) {
    const {data} = await api({
      url: '/Login',
      data: {usuario: documento, pass},
      method: 'post',
    });
    console.log(data);
    let convenio;
    if (!data.erro) {
      setUsuario('Usuario', {documento, pass});
      convenio = {
        id_gds: data.id_gds,
        nome_parceiro: data.nome_parceiro,
        caminho_logomarca: data.caminho_logomarca,
        efetuarVenda: data.efetuarVenda,
      };
      setUsuario('convenio', convenio);

      props.navigation.navigate('Home', convenio);
    } else {
      setState({erro: true, mensagem: 'Usuario ou Senha incorretos'});
    }
  } else {
    setState({erro: true, mensagem: 'Usuario ou Senha incorretos'});
  }
};
