import axios from "axios";
// TESTE;
const api = axios.create({
	baseURL: "http://187.94.98.194:3917/convenios",
});

// OFICIAL
// const api = axios.create({
//   baseURL: 'http://api.abepom.org.br:3972/convenios',
// });
export default api;
