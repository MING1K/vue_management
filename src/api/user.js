import request from '@/utils/request-admin'

/**
 * @description: 登录
 * @param {*} data
 * @return {*}
 */
export function login(data) {
  return request({
    url: '/admin/acl/index/login',
    method: 'post',
    data
  })
}

/**
 * @description: 获取用户信息
 * @param {*} token
 * @return {*}
 */
export function getInfo(token) {
  return request({
    url: '/admin/acl/index/info',
    method: 'get',
    params: { token }
  })
}

/**
 * @description: 登出
 * @return {*}
 */
export function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'post'
  })
}
