import axios from 'axios';
// TESTE
const api = axios.create({
  baseURL: 'http://187.94.98.194:3916',
});



// OFICIAL
// const api = axios.create({
//   baseURL: 'http://mobile.abepom.org.br:3972',
// });
export default api;
