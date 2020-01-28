import {StyleSheet, Dimensions} from 'react-native';

// const primary= '#'
// const primaryBack
// const alert
// const alertBack
// const sucess
// const sucessBack
// const error
// const errorBack

const styles = StyleSheet.create({
  conteiner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
  },
  logoP: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  bgImage: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
  input: {
    backgroundColor: 'white',
    height: 45,
    marginHorizontal: 10,
    marginTop: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#1f4ba4',
    width: Dimensions.get('screen').width * 0.8,
  },
  btnDefault: {
    backgroundColor: '#1f4ba4',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: Dimensions.get('screen').width * 0.8,
  },
  btnDefaultText: {
    color: 'white',
  },
  link: {
    //backgroundColor: 'green',

    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default styles;
