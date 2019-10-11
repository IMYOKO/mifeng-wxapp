const state = {
  isLogin: false
}

const mutations = {
  ['LOGIN'] (state) {
    state.isLogin = !state.isLogin
  }
}

export default {
  namespaced: true,
  state,
  mutations
}