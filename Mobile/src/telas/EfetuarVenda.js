import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput as TextInputrn,
} from 'react-native';
import MenuTop from '../components/MenuTop';
import { TextInput } from 'react-native-paper';
import Mensagem from '../components/Mensagem'
import styles, { primary, danger } from '../utils/Style';
import { TouchableOpacity } from 'react-native-gesture-handler';
import imagens from '../utils/imagens';
import api from '../api';
import getUsuario from '../utils/getUsuario';
import Retorno from '../components/Retorno';


export default props => {
  const vaziu = {
    cartao: '',
    matricula: '',
    dep: '',
  };
  const retornopadrao = { retorno: false, mensagem: '' }
  const [state, setstate] = useState({});
  const [associado, setassociado] = useState(vaziu);
  const [imput, setImput] = useState('');
  const [dependentes, setDependentes] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [avancar, setAvancar] = useState(false);
  const [retorno, setRetorno] = useState(retornopadrao)
  const [erro, setErro] = useState("")

  // useEffect(() => {

  //   switch (imput.length) {
  //     case 0:
  //     case 1:
  //     case 2:
  //     case 3:
  //     case 4:
  //     case 5:
  //       setRetorno(retornopadrao)
  //       setDependentes([])
  //       setMensagem('')
  //     case 6:
  //       setassociado(vaziu);
  //       setMensagem('');
  //       if (imput.length == 6) {
  //         consultarCartao(imput);
  //       }
  //       break;
  //     case 7:
  //       setDependentes([])
  //       setMensagem('')
  //     case 10:
  //       setAvancar(false);
  //       break;
  //     case 11:
  //       setassociado({
  //         cartao: imput,
  //         matricula: imput.substring(0, 6),
  //         dep: imput.substring(7, 9),
  //       });
  //       consultarCartao(imput);
  //       break;
  //     default:
  //       break;
  //   }
  // }, [imput]);

  useEffect(() => {

    getUsuario('convenio').then(convenio => setstate(convenio));


  }, []);


  const consultarCartao = async cartao => {
    setDependentes([])
    setMensagem('')

    if (!!cartao) {

      try {
        const validado = await api({
          url: '/ConsultarCartao',
          method: 'post',
          data: {
            cartao,
          },
        });

        if (validado.data.length) {
          if (validado.data.retorno == 1) {
            setMensagem(validado.data.mensagem);
          }
          setErro('')
          setDependentes(validado.data)
          console.log(validado.data)
        } else {
          console.log(validado.data)

          if (validado.data.avancar == 1) {
            console.log(validado.data)
            setErro('')
            setAvancar(true);
            setMensagem(validado.data.mensagem);

            setassociado({
              cartao: imput,
              matricula: imput.substring(0, 6),
              dep: imput.substring(7, 9),
              nome: validado.data.Nome,
            });
          } else if (validado.data.retorno == 1) {
            setErro(validado.data.mensagem)
          } else {
            setAvancar(false);
          }
        }
      } catch (error) {
        console.log(error)
      }
    } else { setErro('Informe um cartão') }
  };
  return (
    <MenuTop {...props} drawer title="Efetuar Vendas">
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 20,
          width: '80%',
          alignSelf: 'center',
          color: primary,
          marginVertical: 30,
        }}>
        Informe a Matrícula ou o Cartão do assocado para iniciar a venda.
      </Text>

      <View style={{ width: '100%', flexDirection: "row" }}>

        <TextInput
          label="Cartão / Matricula"
          dense
          mode="outlined"
          value={imput}
          onChangeText={setImput}
          theme={{
            colors: {
              primary: primary,
              background: 'white',
              text: primary,
              placeholder: primary,
            },
          }}
          maxLength={11}
          keyboardType="numeric"
          style={[styles.imput, { width: '70%' }]}
          render={props => (
            <>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',

                  justifyContent: 'center',
                }}>
                <TextInputrn {...props} />

                <Image
                  source={imagens.pay}
                  style={{ width: 30, height: 30, margin: 5 }}
                  tintColor={primary}
                />

              </View>
            </>
          )}
        />
        <TouchableOpacity
          style={{
            backgroundColor: primary,
            height: 45,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            borderColor: primary,
            borderWidth: 1,
            paddingHorizontal: 4,
            marginTop: 15,
            marginLeft: 10,
            elevation: 1
          }}
          onPress={() => { consultarCartao(imput) }}>
          <Image
            source={imagens.search}
            style={{ width: 30, height: 30, margin: 5 }}
            tintColor={'white'}
          />
        </TouchableOpacity>
      </View>
      {
        retorno.retorno && (
          <View style={{ width: '80%' }}>
            <Text style={{ fontSize: 11, color: danger }}>{retorno.mensagem}</Text>

          </View>
        )
      }
      {erro ? <View style={{ width: '85%' }}><Retorno type='danger' mensagem={erro} fechar={() => setErro('')} /></View> : null}

      {
        !mensagem ? (
          dependentes && (
            <>
              {dependentes.length > 0 && <Text style={{ marginTop: 30, fontSize: 20, fontWeight: "bold" }}>Selecione um Associado</Text>}
              <View style={{ width: '80%' }}>
                {dependentes.map(item =>
                  (<TouchableOpacity onPress={() => {
                    setImput('');
                    props.navigation.navigate('CadastrarVenda', {
                      cartao: imput,
                      matricula: item.Matricula,
                      dep: item.Cd_dependente,
                      nome: item.NOME,
                      id_gds: state.id_gds,
                    });
                    setRetorno(retornopadrao)
                    setDependentes([])
                    setassociado(vaziu);
                    setAvancar(false);
                  }}
                    style={{ marginTop: 20, padding: 10, width: '100%', backgroundColor: 'white', elevation: 2, borderRadius: 5 }}>

                    <Text style={{ fontWeight: "bold", color: primary }}> Nome: <Text style={{ fontWeight: "100", color: primary }}>{item.NOME}</Text> </Text>
                    <Text style={{ fontWeight: "bold", color: primary }}>
                      Dependencia: <Text style={{ fontWeight: "100", color: primary }}>{item.descri}</Text>
                      {/* Dep: <Text style={{ fontWeight: "100", color: primary }}>{item.Cd_dependente}</Text> */}
                    </Text>

                  </TouchableOpacity>)
                )}

              </View>
            </>
          )
        ) : (
            <View
              style={{
                marginTop: 20,
                backgroundColor: 'white',
                padding: 15,
                elevation: 2,
                borderRadius: 3,
              }}>
              <Text>
                Associado:{' '}
                <Text style={{ fontWeight: 'bold' }}>{associado.nome}</Text>
              </Text>
              <Text>Cartao: {mensagem}</Text>
            </View>
          )
      }
      {
        avancar && (
          <TouchableOpacity
            onPress={() => {
              setImput('');
              props.navigation.navigate('CadastrarVenda', {
                ...associado,
                id_gds: state.id_gds,
              });
              setMensagem('')
              setRetorno(retornopadrao)
              setassociado(vaziu);
              setAvancar(false);
            }}
            style={[{ marginTop: 30 }, styles.btnDefault, { paddingHorizontal: 30 }]}>
            <Text style={styles.btnDefaultText}>EFETUAR VENDA</Text>
          </TouchableOpacity>
        )
      }
    </MenuTop >
  );
};
