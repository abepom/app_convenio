import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import MenuTop from './../components/MenuTop';
import useConvenio from './../../Store/Convenio';
import api from './../api';
import {primary} from './../utils/Style';
import formatCurrency from 'currency-formatter';

export default function RepassesFuturos(props) {
  const [convenio] = useConvenio();
  const [repasses, setRepasses] = useState();
  useEffect(() => {
    api
      .get('/repassesFuturo', {params: {mes: '07', ano: '2020', id: 98}})
      .then(({data}) => {
        let ordenado = data.sort((a, b) => {
          if (a.Nr_lancamento < b.Nr_lancamento) {
            return 1;
          }
          if (a.Nr_lancamento > b.Nr_lancamento) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
        setRepasses(data);
        console.log(ordenado);
      });
  }, []);
  return (
    <>
      <MenuTop drawer {...props} title={'Repasses Futuro'}>
        <FlatList
          data={repasses}
          keyExtractor={(item) => item.Nr_lancamento}
          renderItem={({item}) => {
            console.log(item);
            let data = new Date(item.Data);
            console.log(data);
            return (
              <View
                style={{
                  padding: 10,
                  backgroundColor: 'white',
                  marginHorizontal: 6,
                  marginVertical: 4,
                  elevation: 3,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '29%'}}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 10,
                        color: primary,
                      }}>
                      Matricula:{' '}
                    </Text>
                    <Text> {item.Matricula}</Text>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 10,
                        color: primary,
                      }}>
                      Lançamento:{' '}
                    </Text>
                    <Text> {item.Nr_lancamento}</Text>
                    <View>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 10,
                          color: primary,
                        }}>
                        Data:{' '}
                      </Text>
                      <Text> {data.toLocaleString().substr(0, 10)}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      justifyContent: 'center',
                      marginLeft: 5,
                      width: '69%',
                    }}>
                    {item['NomeTitular'] != item['Nome do dependente'] && (
                      <>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            fontSize: 10,
                            color: primary,
                          }}>
                          Dependente:{' '}
                        </Text>
                        <Text> {item['Nome do dependente']}</Text>
                      </>
                    )}
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 10,
                        color: primary,
                      }}>
                      Associado:{' '}
                    </Text>
                    <Text> {item['NomeTitular']}</Text>
                    <View style={{}}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 10,
                          color: primary,
                        }}>
                        Valor:{' '}
                      </Text>
                      <Text style={{fontSize: 18}}>
                        {formatCurrency.format(item.subtotal, {code: 'BRL'})}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={() => <ActivityIndicator />}
        />
      </MenuTop>
      <View
        style={{
          flexDirection: 'row',
          alignContent: 'space-between',
          width: '95%',
          alignSelf: 'center',
          marginVertical: 5,
          marginTop: 10,
        }}>
        <View
          style={{
            width: '48%',
            marginRight: '2%',
            alignItems: 'center',
            backgroundColor: primary,
            borderRadius: 50,
            marginBottom: 10,
          }}>
          <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 10}}>
            ATENDIMENTOS
          </Text>
          <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 20}}>
            {repasses ? repasses.length : '0'}
          </Text>
        </View>
        <View
          style={{
            width: '48%',
            marginLeft: '2%',
            alignItems: 'center',
            backgroundColor: primary,
            borderRadius: 50,
            marginBottom: 10,
          }}>
          <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 10}}>
            TOTAL
          </Text>
          <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 20}}>
            {repasses
              ? formatCurrency.format(
                  repasses.reduce(
                    (total, subtotal) => total + Number(subtotal.subtotal),
                    0,
                  ),
                  {code: 'BRL'},
                )
              : 'R$ 0,00'}
          </Text>
        </View>
      </View>
    </>
  );
}
