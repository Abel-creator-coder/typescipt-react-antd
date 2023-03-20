import axios from 'axios';
import { apiUrl } from './url';

axios.defaults.headers['Content-Type'] = 'application/json';

// 创建axios实例
const service = axios.create({
    baseURL: apiUrl,
    timeout: 60 * 1000
});

// 请求拦截器
service.interceptors.request.use(
    config => {
        return config;
    }, 
    error => {
        return Promise.reject(error);
    }
)

// 响应拦截器
service.interceptors.response.use(
    response => {
        console.log(response.data);
        return response.data;
    },
    error => {
        console.log('error===', error.response)
        return Promise.reject(error);
    }
)

export default service;
