import {StyleSheet, Dimensions} from 'react-native';

export const primary = '#04254e';
export const primaryBack = '#124268';
export const alert = '#7f6937';
export const alertBack = '#fff3cd';
export const sucess = '#284c26';
export const sucessBack = '#d4edda';
export const danger = '#572830';
export const danverBackground = '#f7d7da';
export const white = '#fff';
export const black = '#222';

const styles = StyleSheet.create({
  conteiner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {alignItems: 'center', justifyContent: 'center'},
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
  logoPP: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 25,
  },
  bgImage: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
  imput: {
    width: '80%',
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginTop: 10,
  },
  input: {
    backgroundColor: 'white',
    height: 45,
    marginHorizontal: 10,
    marginTop: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: primary,
    width: Dimensions.get('screen').width * 0.8,
  },
  btnDefault: {
    backgroundColor: '#6c757c',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  btnDefaultText: {
    color: white,
  },
  link: {
    //backgroundColor: 'green',

    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
  },
  itemMenu: {
    padding: 10,
    borderWidth: 2,
    borderColor: primaryBack,
    backgroundColor: white,
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    paddingVertical: 30,
  },
  linhaMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  textMenu: {textAlign: 'center', marginTop: 10, color: primary},
});

export default styles;
