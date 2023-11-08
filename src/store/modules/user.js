/* eslint-disable new-cap */
import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, constantRoutes, anyRoutes } from '@/router/index.js'
import router from '@/router/index.js'
import { asyncRoutes } from '@/router/asyncRoutes.js'

const getDefaultState = () => {
  return {
    // 获取token
    token: getToken(),
    // 存储用户名
    name: '',
    // 存储用户头像
    avatar: '',
    // 存储路由权限
    routes: [],
    // 存储按钮权限
    buttons: [],
    // 存储用户角色
    roles: [],
    // 存储过滤后的菜单
    filterMenu: [],
    // 最终菜单
    allRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERINFO: (state, userInfo) => {
    // 用户名
    // state.name = userInfo.name
    // 用户头像
    // state.avatar = userInfo.avatar
    // 菜单权限标记
    state.routes = userInfo.routes
    // 用户角色
    state.buttons = userInfo.buttons
    // 按钮权限
    state.roles = userInfo.roles
  },
  SET_FILTERMENU: (state, filterMenu) => {
    state.filterMenu = filterMenu
    state.allRoutes = constantRoutes.concat(state.filterMenu, anyRoutes)
    router.addRoutes(state.allRoutes)
  }
}

const actions = {
  // 登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    // let result = login({ username: username.trim(), password });
    // if (result.code === 200) {
    //   commit('SET_TOKEN', result.data.token);
    //   setToken(result.data.token);
    //   return 'ok';
    // } else {
    //   return new Promise.reject(new Error('fail'));
    // }
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        // 返回用户名name，用户头像avatar，routes标志不同用户应该展示哪些菜单，roles用户角色，buttons按钮权限
        console.log(response.data)

        const { data } = response

        if (!data) {
          return reject('登陆失败，请重试！')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_USERINFO', data)
        commit('SET_FILTERMENU', filterMenus(asyncRoutes, data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 登出
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

// 过滤
const filterMenus = (asyncRoutes, routes) => {
  console.log(asyncRoutes, routes)
  return asyncRoutes.filter(item => {
    if (routes.indexOf(item.name) !== -1) {
      if (item.children && item.children.length > 0) {
        item.children = filterMenus(item.children, routes)
      }
      return true
    }
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

