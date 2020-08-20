import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, RefreshControl} from 'react-native';
import MenuTop from './../components/MenuTop';
import useConvenio from './../../Store/Convenio';
import api from './../api';
import {primary} from './../utils/Style';
import formatCurrency from 'currency-formatter';
import Carregando from '../components/Carregando';
import {FlatList} from 'react-native-gesture-handler';

export default function RepassesFuturos(props) {
  const [refreshing, setRefreshing] = useState(false);
  const [{id_gds}] = useConvenio();
  const [repasses, setRepasses] = useState();
  const getRepasse = () => {
    setRepasses(null);
    api.get('/repassesFuturo', {params: {id: id_gds}}).then(({data}) => {
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
      setRepasses(ordenado);
    });
  };
  useEffect(() => {
    getRepasse();
  }, []);
  return (
    <>
      <MenuTop drawer {...props} title={'Repasses Futuro'}>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={getRepasse} />
          }
          data={repasses}
          keyExtractor={(item) => item.Nr_lancamento}
          renderItem={({item}) => {
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
                      <Text> {item.Data}</Text>
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
          ListEmptyComponent={() => <Carregando />}
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
            width: '20%',
            marginRight: '2%',
            alignItems: 'center',
            backgroundColor: primary,
            borderRadius: 50,
            marginBottom: 10,
          }}>
          <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 10}}>
            VENDAS
          </Text>
          <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 20}}>
            {repasses ? repasses.length : '0'}
          </Text>
        </View>
        <View
          style={{
            width: '33%',
            marginHorizontal: '2%',
            alignItems: 'center',
            backgroundColor: primary,
            borderRadius: 50,
            marginBottom: 10,
          }}>
          <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 10}}>
            MÊS DE REPASSE
          </Text>
          <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 20}}>
            {repasses ? repasses[0].Mesano : '0'}
          </Text>
        </View>
        <View
          style={{
            width: '39%',
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
