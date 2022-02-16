import api from "../api";
import useConvenio from "../Data/Convenio";
import useUsuario from "../Data/Usuario";

const conectar = async (imput, navigation, setCarregando, setState) => {
	const [, setUsuario] = useUsuario();
	const [, setConv] = useConvenio();
	setCarregando(true);
	const { doc, pass } = imput;
	if (doc.length > 1 && pass) {
		try {
			const { data } = await api.post("/Login", {
				doc: doc,
				senha: pass,
				convenios: true,
			});
			let convenio;
			if (!data.erro) {
				const procedimentos = await api({
					method: "POST",
					url: "/procedimentos",
					data: { cd_da_area: data["cd_convênio"] },
					headers: { "x-access-token": data.token },
				});
				setUsuario(imput);
				convenio = {
					id_gds: data.id_gds,
					nome_parceiro: data.nome_parceiro,
					caminho_logomarca: data.caminho_logomarca
						? `${data.caminho_logomarca}?id=${Math.random()}`
						: null,
					efetuarVenda: data.efetuarVenda,
					doc: data.doc,
					usuario: data.usuario,
					nivel: data.nivel,
					token: data.token,
					cd_convenio: data["cd_convênio"],
					primeiro_acesso: data.primeiro_acesso,
					tipo_lancamento: data.tipo_lancamento,
					cd_da_area: data.Cd_da_area,
					efetuarVenda: data.efetuarVenda,

					procedimentos: procedimentos.data,
				};

				await setConv(convenio);
				navigation.navigate("Aplicacao");
				setState({
					erro: false,
					mensagem: "",
				});
			} else {
				setCarregando(false);
				setState({ erro: true, mensagem: "Usuário ou Senha incorretos" });
			}
		} catch (error) {
			setState({ erro: true, mensagem: "Usuário ou Senha incorretos" });
			setCarregando(false);
		}
	} else {
		setState({ erro: true, mensagem: "Usuário ou Senha incorretos" });

		setCarregando(false);
	}
};

export default conectar;
