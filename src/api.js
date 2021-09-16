import axios from "axios";
// Local
// const api = axios.create({
// 	baseURL: "http://192.168.1.61:3333/convenios",
// });

// TESTE;
const api = axios.create({
	baseURL: "http://apiteste.abepom.org.br:3917/convenios",
});

// OFICIAL
// const api = axios.create({
// 	baseURL: "http://api.abepom.org.br:3972/convenios",
// });
export default api;
