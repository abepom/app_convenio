import React, {useState, useMemo} from 'react';
import {View, Easing, Animated, Image, Text} from 'react-native';
import imagens from '../utils/imagens';

export default Carregando = (props) => {
  let {cor, tamanho = 50, icone = true, abepom = false} = props;

  const [giroVerde] = useState(new Animated.Value(0));
  const [giroVermelho] = useState(new Animated.Value(0));
  const [palavra] = useState(new Animated.Value(0));

  Animated.loop(
    Animated.sequence([
      Animated.parallel([
        Animated.timing(giroVerde, {
          toValue: -6.25,
          duration: 800,
          useNativeDriver: false,
          easing: Easing.linear,
        }),
        Animated.timing(giroVermelho, {
          toValue: 6.31,
          duration: 800,
          useNativeDriver: false,
          easing: Easing.linear,
        }),
      ]),
      Animated.timing(palavra, {
        toValue: 1,
        useNativeDriver: false,
        duration: abepom ? 1000 : 200,
      }),
      Animated.timing(palavra, {
        toValue: 0,
        useNativeDriver: false,
        duration: abepom ? 1000 : 200,
      }),
    ]),
  ).start();

  return (
    <View
      style={{
        width: tamanho,
        height: tamanho,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
      }}>
      <Animated.View
        style={{
          width: tamanho,
          height: tamanho,
          transform: [{rotate: giroVerde}],
          position: 'absolute',
        }}>
        <Image
          source={imagens.linha_verde}
          style={{width: tamanho, height: tamanho, tintColor: cor ?? null}}
        />
      </Animated.View>
      <Animated.View
        style={{
          width: tamanho,
          height: tamanho,
          transform: [{rotate: giroVermelho}],
          position: 'absolute',
        }}>
        <Image
          source={imagens.linha_vermelha}
          style={{width: tamanho, height: tamanho, tintColor: cor ?? null}}
        />
      </Animated.View>
      {icone && (
        <>
          {!cor && (
            <Image
              source={imagens.circulo_branco}
              style={{width: tamanho, height: tamanho}}
            />
          )}
          <Image
            source={imagens.circulo_estrela_vazada}
            style={{
              width: tamanho,
              height: tamanho,

              position: 'absolute',
              tintColor: cor ?? null,
            }}
          />
        </>
      )}
      {abepom && (
        <Animated.View
          style={{
            width: tamanho,
            height: tamanho,
            opacity: palavra,

            position: 'absolute',
          }}>
          <Image
            source={imagens.txtabepom}
            style={{
              width: tamanho,
              height: tamanho,
              tintColor: cor ?? 'white',
            }}
          />
        </Animated.View>
      )}
    </View>
  );
};
