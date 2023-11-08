/*
权限管理相关的API请求函数
*/
import request from '@/utils/request-admin'
import utils from '@/utils/utils'

/**
 * @description: 获取权限(菜单/功能)列表
 * @return {*}
 */
export function getPermissionList() {
  return request({
    url: `/admin/acl/permission`,
    method: 'get'
  }).then(res => {
    utils.treeBeforeForeach(res.data.children, item => {
      item._id = item.id
      // item.hasChildren = true
    })
    return res
  })
}

/**
 * @description: 删除一个权限项
 * @param {*} id
 * @return {*}
 */
export function removePermission(id) {
  return request({
    url: `/admin/acl/permission/remove/${id}`,
    method: 'delete'
  })
}

/**
 * @description: 保存一个权限项
 * @param {*} permission
 * @return {*}
 */
export function addPermission(permission) {
  return request({
    url: `/admin/acl/permission/save`,
    method: 'post',
    data: permission
  })
}

/**
 * @description: 更新一个权限项
 * @param {*} permission
 * @return {*}
 */
export function updatePermission(permission) {
  return request({
    url: `/admin/acl/permission/update`,
    method: 'put',
    data: permission
  })
}

/**
 * @description: 查看某个角色的权限列表
 * @param {*} roleId
 * @return {*}
 */
export function toAssign(roleId) {
  return request({
    url: `/admin/acl/permission/toAssign/${roleId}`,
    method: 'get'
  })
}

/**
 * @description: 给某个角色授权
 * @param {*} roleId
 * @param {*} permissionId
 * @return {*}
 */
export function doAssign({ roleId, permissionId }) {
  return request({
    url: `/admin/acl/permission/doAssign`,
    method: 'post',
    params: { roleId, permissionId }
  })
}

