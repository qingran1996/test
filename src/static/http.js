import axios from 'axios'
import { Toast } from 'vant';
import router from '../router/index.js'



const baseURL = 'http://192.168.10.152:10005'
axios.defaults.timeout = 50000
axios.defaults.baseURL = baseURL // 关键步骤–填写后台请求统一的地址   外网地址头:http://61.177.60.14:10005/a 内网:http://192.168.1.184:10005/a
axios.defaults.withCredentials = true



// 请求拦截  设置统一header
axios.interceptors.request.use(
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
    loading.close()
	Toast.fail('加载超时');
    return Promise.reject(error)
  }
)

// 响应拦截  401 token过期处理
axios.interceptors.response.use(
  response => {
    // endLoading();
    // console.log(1)
    return response
  },
  error => {
    switch (error.response.status) {
      case 401:
        Toast.fail('加载超时');
        break
      case 500:
        Toast.fail('系统繁忙');
        break
      case 404:
        Toast.fail('地址请求错误');
        break
      case 403:
	    Toast.fail('权限不足,请联系管理员!');
        break
    }

    return Promise.reject(error)
  }
)

export default axios
