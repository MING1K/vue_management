import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

/**
 * sessionStorage
 * 存储用户信息和菜单信息
*/

let keys = {
  userInfo: 'userInfo',
  menus: 'menus'
}
export const storageHelper = {
  // cookie
  getToken() {
    return Cookies.get(TokenKey)
  },
  setToken(token) {
    return Cookies.set(TokenKey, token)
  },
  removeToken() {
    return Cookies.remove(TokenKey)
  },
  // sessionStorage
  clear() {
    sessionStorage.clear()
  },
  setUserInfo(userInfo) {
    sessionStorage.setItem(keys.userInfo, JSON.stringify(userInfo))
  },
  getUserInfo() {
    return JSON.parse(sessionStorage.getItem(keys.userInfo))
  },

  setMenus(menus) {
    sessionStorage.setItem(keys.menus, JSON.stringify(menus))
  },
  getMenus() {
    return JSON.parse(sessionStorage.getItem(keys.menus))
  }
}
