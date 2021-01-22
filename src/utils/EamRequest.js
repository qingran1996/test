import axios from "axios";
import { Toast } from 'vant';

let config = {
	baseURL: 'http://192.168.10.152:10005',
};
const service = axios.create(config)

service.interceptors.request.use(
	config => {
		// 加载
		// startLoading();
		if (localStorage.eleToken) {
			config.headers.Authorization = 'Bearer ' + localStorage.eleToken
		}
		// console.log(config.url)
		return config
	},
	error => {
		Toast('加载超时');
		return Promise.reject(error)
	}
)

service.interceptors.response.use(
	response => response
)

export default service
