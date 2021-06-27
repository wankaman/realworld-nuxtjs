import { request } from '@/plugins/request.js'

// 获取文章列表
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/api/articles',
    params,
  })
}

// 获取用户关注文章列表
export const getFeedArticles = params => {
  return request({
    method: 'GET',
    url: '/api/articles/feed',
    // headers: {
    //   // 添加用户身份，数据格式： Token空格Token数据
    //   Authorization: 'Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTc4NTMyLCJ1c2VybmFtZSI6IndhbmdrYW1hbiIsImV4cCI6MTYzMDAwMzYzN30.m_5hoD5ATdwrswaPYLJK2_Ze6n0Yq9PTlt2w2Vefaj0'
    // },
    params,
  })
}

// 添加点赞
export const addFavorite = slug => {
  return request({
    method: 'POST',
    url: `/api/articles/${slug}/favorite`,
  })
}

// 取消点赞
export const deleteFavorite = slug => {
  return request({
    method: 'DELETE',
    url: `/api/articles/${slug}/favorite`,
  })
}

// 获取文章信息
export const getArticle = slug => {
  return request({
    method: 'GET',
    url: `/api/articles/${slug}`,
  })
}
