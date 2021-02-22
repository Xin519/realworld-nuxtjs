import { request } from '@/plugins/request'

// 获取公共文章列表
export const getArticle = params =>{
    return request({
        method: 'GET', 
        url:'/api/articles',
        params
    })
}

export const getYourFeedArticles = params => {
    return request({
        method: 'GET',
        url: '/api/articles/feed',
        // headers: {
        //   // 添加用户身份，数据格式：Token空格Token数据
        //   Authorization: `Token `
        // },
        params
     
    })
}

// 添加点赞
export const addFavorite = slug => {
    return request({
      method: 'POST',
      url: `/api/articles/${slug}/favorite`
    })
}
  
// 取消点赞
export const deleteFavorite = slug => {
    return request({
      method: 'DELETE',
      url: `/api/articles/${slug}/favorite`
    })
}

// 获取文章详情
export const getArticles = slug => {
    return request({
      method: 'GET',
      url: `/api/articles/${slug}`
    })
  }
  
  // 获取文章评论
  export const getComments = slug => {
    return request({
      method: 'GET',
      url: `/api/articles/${slug}/comments`
    })
  }
  

  export const CommentsArticle = (data, slug) =>{
    return request({
        method: 'POST', 
        url:`/api/articles/${slug}/comments`,
        data
    })
  }

  export const addArticles = data =>{
    console.log(data)
    return request({
        method: 'POST', 
        url:`/api/articles`,
        data
    })
  }

  export const updateArticles = (data,slug) =>{
    alert(2)
    return request({
        method: 'PUT', 
        url:`/api/articles/${slug}`,
        data
    })
  }

  export const deleteArticles = slug =>{
    return request({
        method: 'DELETE', 
        url:`/api/articles/${slug}`
    })
  }

