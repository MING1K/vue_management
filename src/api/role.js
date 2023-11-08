/*
 * @Author       : ming
 * @Date         : 2023-11-06 21:26:04
 * @LastEditors  : ming
 * @LastEditTime : 2023-11-08 19:34:30
 * @Description  : role api
 */
/*
角色管理相关的API请求函数
*/
import request from '@/utils/request-admin'

/*
  获取角色分页列表(带搜索)
  */
export function getPageList({ page, limit, roleName }) {
  return request({
    url: `/admin/acl/role/${page}/${limit}`,
    method: 'get',
    params: { roleName } // url查询字符串或表单键值对
  })
}

/*
  获取某个角色
  */
export function getById(id) {
  return request({
    url: `/admin/acl/role/get/${id}`,
    method: 'get'
  })
}

/*
  保存一个新角色
  */
export function save(role) {
  return request({
    url: `/admin/acl/role/save`,
    method: 'post',
    data: role
  })
}

/*
  更新一个角色
  */
export function updateById(role) {
  return request({
    url: `/admin/acl/role/update`,
    method: 'put',
    data: role
  })
}

/*
  获取一个角色的所有权限列表
  */
export function getAssign(roleId) {
  return request({
    url: `/admin/acl/role/toAssign/${roleId}`,
    method: 'get'
  })
}

/*
  删除某个角色
  */
export function removeById(id) {
  return request({
    url: `/admin/acl/role/remove/${id}`,
    method: 'delete'
  })
}

/*
  批量删除多个角色
  */
export function removeRoles(ids) {
  return request({
    url: `/admin/acl/role/batchRemove`,
    method: 'delete',
    data: ids
  })
}

