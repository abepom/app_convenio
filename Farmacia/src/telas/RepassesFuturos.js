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

export default function RepassesFuturos(props) {
  const [convenio] = useConvenio();
  const [repasses, setRepasses] = useState();
  useEffect(() => {
    api
      .get('/repassesFuturo', {params: {mes: '07', ano: '2020', id: 98}})
      .then(({data}) => setRepasses(data));
  }, []);
  return (
    <>
      <MenuTop
        drawer
        {...props}
        title={'Repasses Futuro'}
        header={
          <View style={{width: '80%', alignItems: 'center'}}>
            <Text>Header</Text>
          </View>
        }>
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
                        fontSize: 8,
                        color: primary,
                      }}>
                      Matricula:{' '}
                    </Text>
                    <Text> {item.Matricula}</Text>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 8,
                        color: primary,
                      }}>
                      Lançamento:{' '}
                    </Text>
                    <Text> {item.Nr_lancamento}</Text>
                    <View>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 8,
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
                            fontSize: 8,
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
                        fontSize: 8,
                        color: primary,
                      }}>
                      Associado:{' '}
                    </Text>
                    <Text> {item['NomeTitular']}</Text>
                    <View style={{}}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 8,
                          color: primary,
                        }}>
                        Valor:{' '}
                      </Text>
                      <Text style={{fontSize: 18}}>R$ {item.subtotal}</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={() => <ActivityIndicator />}
        />
      </MenuTop>
    </>
  );
}
