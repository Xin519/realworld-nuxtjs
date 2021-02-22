import { request } from '@/plugins/request'

// 登录
export const login = data =>{
    console.log(data)
    return request({
        method: 'POST',
        url:'/api/users/login',
        data
    })
}


// 注册
export const registration = data =>{
    return request({
        method: 'POST',
        url:'/api/users',
        data
    })
}

// 获取
export const getUser = () =>{
    return request({
        method: 'GET',
        url:'/api/user'
    })
}

// 更新
export const putsUser = data =>{
    console.log(data)
    return request({
        method: 'put',
        url:'/api/user',
        data
    })
}


