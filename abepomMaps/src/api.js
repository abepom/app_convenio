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
  baseURL: 'http://187.94.98.194:3333',
});
export default api;
