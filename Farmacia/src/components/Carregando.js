import React, {useState, useRef, useEffect} from 'react';
import {View, Text, Image, Animated, TouchableOpacity} from 'react-native';
import imagens from '../utils/imagens';
import {Easing} from 'react-native-reanimated';

export default function Carregando() {
  let spinValue = new Animated.Value(0);
  // First set up animation
  Animated.timing(spinValue, {
    toValue: 1,
    duration: 2000,
    easing: Easing.sin,
    useNativeDriver: true,
  }).start();

  // Second interpolate beginning and end values (in this case 0 and 1)
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  console.log(spin);
  return (
    <View style={{flex: 1}}>
      <Animated.View
        style={{
          width: 50,
          height: 50,
          position: 'absolute',
        }}>
        <Image
          source={imagens.linha_verde}
          style={{width: 50, height: 50, transform: [{rotate: spin}]}}
        />
      </Animated.View>
      <Animated.View
        style={{
          width: 50,
          height: 50,
          position: 'absolute',
        }}>
        <Image
          source={imagens.linha_vermelha}
          style={{width: 50, height: 50}}
        />
      </Animated.View>
      <Animated.View
        style={{
          width: 50,
          height: 50,
          position: 'absolute',
        }}>
        <Image source={imagens.logo_circulo} style={{width: 50, height: 50}} />
      </Animated.View>
    </View>
  );

  return (
    <View style={{flex: 1}}>
      <Image
        source={imagens.linha_verde}
        style={{width: 100, height: 100, position: 'absolute'}}
      />

      <Animated.Image
        source={imagens.linha_vermelha}
        style={{
          width: 100,
          height: 100,
          position: 'absolute',
          transform: [{rotate: lVermelho + 'deg'}],
        }}
      />

      <Image
        source={imagens.logo_circulo}
        style={{width: 100, height: 100, position: 'absolute'}}
      />

      <TouchableOpacity onPress={() => {}} style={{alignSelf: 'center'}}>
        <Text>rodar</Text>
      </TouchableOpacity>
    </View>
  );
}
