import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput as TextInputrn,
} from 'react-native';
import MenuTop from '../components/MenuTop';
import {TextInput} from 'react-native-paper';

import styles, {primary} from '../utils/Style';
import {TouchableOpacity} from 'react-native-gesture-handler';
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
  const [state, setstate] = useState({});
  const [associado, setassociado] = useState(vaziu);
  const [imput, setImput] = useState('');
  const [dependentes, setDependentes] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [avancar, setAvancar] = useState(false);
  useEffect(() => {
    console.log(props, 'efetuarvenda');
    switch (imput.length) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        setassociado(vaziu);
        setMensagem('');
        if (imput.length == 6) {
          consultarDependentes();
        }
        break;
      case 10:
        setAvancar(false);
        break;
      case 11:
        setassociado({
          cartao: imput,
          matricula: imput.substring(0, 6),
          dep: imput.substring(7, 9),
        });

        consultarCartao(imput);
        break;

      default:
        break;
    }
  }, [imput]);

  useEffect(() => {
    getUsuario('convenio').then(convenio => setstate(convenio));
  }, []);

  const consultarDependentes = async () => {
    const dependentes = await api.get('/Dependentes', {
      params: {matricula: associado.matricula},
    });
    if (dependentes.data.erro) {
      // setMensagem(dependentes.data.mensagem);
    } else {
      setDependentes(dependentes.data.dependentes);
    }
  };
  const consultarCartao = async cartao => {
    console.log(cartao, 'cartao');
    const validado = await api({
      url: '/ConsultarCartao',
      method: 'post',
      data: {
        cartao,
      },
    });

    if (validado.data.avancar == 1) {
      setAvancar(true);
      setMensagem(validado.data.mensagem);

      setassociado({
        cartao: imput,
        matricula: imput.substring(0, 6),
        dep: imput.substring(7, 9),
        nome: validado.data.Nome,
      });
    } else {
      setAvancar(false);
    }
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
        Informe o Cartão do associado para iniciar a venda.
      </Text>
      <Text
        style={{
          fontSize: 14,
          width: '80%',
          alignSelf: 'center',
          color: primary,
        }}>
        É obrigatório o preenchimento dos 11 digitos do cartão. Caso o associado
        NUNCA recebeu um cartão da ABEPOM digite sua matrícula.
      </Text>

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
        style={[styles.imput, {}]}
        render={props => (
          <>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',

                justifyContent: 'center',
              }}>
              <TextInputrn {...props} />
              <TouchableOpacity style={{margin: 5}}>
                <Image
                  source={imagens.search}
                  style={{width: 30, height: 30}}
                  tintColor={primary}
                />
              </TouchableOpacity>
            </View>
          </>
        )}
      />

      {!mensagem ? (
        dependentes && (
          <FlatList
            data={dependentes}
            renderItem={({item}) => {
              console.log(item);
              return <Text>{item.nome}</Text>;
            }}
          />
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
            <Text style={{fontWeight: 'bold'}}>{associado.nome}</Text>
          </Text>
          <Text>Cartao: {mensagem}</Text>
        </View>
      )}
      {avancar && (
        <TouchableOpacity
          onPress={() => {
            setImput('');
            props.navigation.navigate('CadastrarVenda', {
              ...associado,
              id_gds: state.id_gds,
            });
            setassociado(vaziu);
            setAvancar(false);
          }}
          style={[{marginTop: 30}, styles.btnDefault, {paddingHorizontal: 30}]}>
          <Text style={styles.btnDefaultText}>EFETUAR VENDA</Text>
        </TouchableOpacity>
      )}
    </MenuTop>
  );
};
