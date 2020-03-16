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
    console.log(associado);
    switch (imput.length) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        setassociado({
          cartao: '',
          matricula: imput,
          dep: '',
        });
        setMensagem('');
        if (imput.length == 6) {
          consultarDependentes();
        }
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
      await setMensagem(dependentes.data.mensagem);
    } else {
      await setDependentes(dependentes.data.dependentes);
    }
  };
  const consultarCartao = async cartao => {
    const validado = await api({
      url: '/ConsultarCartao',
      method: 'post',
      data: {
        cartao,
      },
    });
    console.log(validado);
    if (validado.data) {
      setAvancar(false);
    } else {
      setAvancar(true);
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
        keyboardType="default"
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
        <Text>{mensagem}</Text>
      )}
      {avancar && <TouchableOpacity></TouchableOpacity>}
    </MenuTop>
  );
};
