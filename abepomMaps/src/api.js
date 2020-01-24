import Axios from 'axios';
import qs from 'qs';

String.prototype.replaceAll = function(de, para) {
  var str = this;
  var pos = str.indexOf(de);
  while (pos > -1) {
    str = str.replace(de, para);
    pos = str.indexOf(de);
  }
  return str;
};

const api = Axios.create({
  baseURL: 'http://192.168.1.238/APP_mobile/',
  headers: {
    //'content-type': 'text/html',
    'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
  },

  transformRequest: [
    function(dados, headers) {
      //   data = JSON.stringify(data)
      //     .replace(/","/, '&')
      //     .replace('{"', '')
      //     .replace('"}', '')

      //     .replace(/":"/g, '=');
      console.log(dados);
      return qs.stringify(dados);
    },
  ],
  transformResponse: [
    data => {
      return JSON.parse(data.replaceAll(String.fromCharCode(10), ''));
    },
  ],
});
export default api;
