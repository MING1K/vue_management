import { getDashBoardList } from '@/api/dashboard'
const state = {
  data: null
}

const mutations = {
  getAllData(state, res) {
    state.data = res.data
  }
}

const actions = {
  getData({ commit }) {
    getDashBoardList().then(
      res => {
        commit('getAllData', res)
      })
      .catch(err => {
        this.$message.error('获取数据失败，请重试', err)
      })
  }
}
const getters = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
