import Axios from 'axios';

const api = Axios.create({
  baseURL: 'http://187.94.98.194:3333',
});
export default api;
