import axios from "axios";

const api = axios.create({
	baseURL: "http://187.94.98.195:3333"
});

export default api;
