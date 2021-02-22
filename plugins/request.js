// axios 封装

import axios from 'axios'

export const request = axios.create({
    baseURL:'https://conduit.productionready.io'
})

// 通过插件机制获取上下文对象 query params ret res ........
// 插件导出函数必须作为 default 成员
export default ({ store }) => {

    // 任何请求都要经过请求拦截器
    // 可以设置公共业务处理 设置token等
    request.interceptors.request.use(function (config) {
        // Do something before request is sent
        const { user } = store.state
        if(user && user.token) config.headers.Authorization = `Token ${user.token}`

        return config;
    }, function (error) {
        // 请求失败（未发出）
        // Do something with request error
        return Promise.reject(error);
    })
}



// export default request