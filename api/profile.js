import { request } from '@/plugins/request.js'

// 获取用户信息
export const getProfileUser = username => {
  return request({
    method: 'GET',
    url: `/api/profiles/${username}`,
  })
}

// 添加关注
export const addFollow = username => {
  return request({
    method: 'POST',
    url: `/api/profiles/${username}/follow`,
  })
}

// 取消关注
export const deleteFollow = username => {
  return request({
    method: 'DELETE',
    url: `/api/profiles/${username}/follow`,
  })
}
