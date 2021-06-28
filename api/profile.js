import { request } from '@/plugins/request.js'

// 获取用户信息
export const getProfileUser = username => {
  return request({
    method: 'GET',
    url: `/api/profiles/${username}`,
  })
}
