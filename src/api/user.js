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

// 用户管理

/**
 * @description: 获取当前用户的菜单权限列表
 * @return {*}
 */
export function getMenu() {
  return request({
    url: '/admin/acl/index/menu',
    method: 'get'
  })
}

/**
 * @description: 获取后台用户分页列表(带搜索)
 * @param {*} page
 * @param {*} limit
 * @param {*} username
 * @return {*}
 */
export function getPageList({ page, limit, username }) {
  let params = { username }
  return request({
    url: `/admin/acl/user/${page}/${limit}`,
    method: 'get',
    params: params
  })
}

/**
 * @description: 根据ID获取某个后台用户
 * @param {*} id
 * @return {*}
 */
export function getById(id) {
  return request({
    url: `/admin/acl/user/get/${id}`,
    method: 'get'
  })
}

/**
 * @description: 保存一个新的后台用户
 * @param {*} user
 * @return {*}
 */
export function add(user) {
  return request({
    url: `/admin/acl/user/save`,
    method: 'post',
    data: user
  })
}

/**
 * @description: 更新一个后台用户
 * @param {*} user
 * @return {*}
 */
export function update(user) {
  return request({
    url: `/admin/acl/user/update`,
    method: 'put',
    data: user
  })
}

/**
 * @description: 获取某个用户的所有角色
 * @param {*} userId
 * @return {*}
 */
export function getRoles(userId) {
  return request({
    url: `/admin/acl/user/toAssign/${userId}`,
    method: 'get'
  })
}

/**
 * @description: 给某个用户分配角色
 * @param {*} userId
 * @param {*} roleId: 结构: 字符串, 'rId1,rId2,rId3'
 * @return {*}
 */
export function assignRoles({ userId, roleId }) {
  return request({
    url: `/admin/acl/user/doAssign`,
    method: 'post',
    params: {
      userId,
      roleId
    }
  })
}

/**
 * @description: 删除某个用户
 * @param {*} id
 * @return {*}
 */
export function removeById(id) {
  return request({
    url: `/admin/acl/user/remove/${id}`,
    method: 'delete'
  })
}

/**
 * @description: 批量删除多个用户
 * @param {*} ids // ids是包含n个id的数组
 * @return {*}
 */
export function removeUsers(ids) {
  return request({
    url: `/admin/acl/user/batchRemove`,
    method: 'delete',
    data: ids
  })
}
