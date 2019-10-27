const state = {
  userInfo: uni.getStorageSync('userInfo') || null
}

const mutations = {
  ['SETUSERINFO'] (state, paylaod) {
    state.userInfo = paylaod
  }
}

export default {
  namespaced: true,
  state,
  mutations
}