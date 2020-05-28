import axios from 'axios';

const api = axios.create({
  baseURL: 'http://187.94.98.194:3916',
});
export default api;
