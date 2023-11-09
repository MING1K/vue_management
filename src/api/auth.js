/*
 * @Author       : ming
 * @Date         : 2023-11-09 00:04:48
 * @LastEditors  : ming
 * @LastEditTime : 2023-11-09 16:19:30
 * @Description  : auth control
 */
/** 按钮权限管理 */
import { storageHelper } from '@/utils/auth'

/** 获取token
 *
 * @returns
 */
export function getToken() {
  return storageHelper.getToken()
}

/** 是否拥有某一角色权限
 *
 * @param {*} roleCode  权限代码
 * @returns
 */
export function hasRolePermission(roleCode) {
  const user = storageHelper.getUserInfo()
  return user?.roles?.some(s => s === roleCode)
}

/** 是否拥有某一按钮权限
 *
 * @param {*} buttonCode  权限代码
 * @returns
 */
export function hasPermission(buttonCode) {
  const user = storageHelper.getUserInfo()
  return user?.buttons?.some(s => s === buttonCode)
}

// /** 是否是登录用户
//  *
//  * @param {*} useId 用户gid
//  * @returns
//  */
// export function isUser(useId) {
//   const user = storageHelper.getUserInfo()
//   return user?.userId === useId
// }

