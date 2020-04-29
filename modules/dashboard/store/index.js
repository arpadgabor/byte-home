export const state = () => ({
  token: null,
  interval: null
})

export const mutations = {
  setToken (state, token) {
    state.token = token
  },
  setInterval(state, interval) {
    state.interval = interval
  },
  clearInterval(state) {
    clearInterval(state.interval)
    state.interval = null
  }
}

export const actions = {
  async nuxtServerInit({ dispatch }) {
    let token = await dispatch('refreshToken')
  },

  async refreshToken({ state, commit }) {
    let response = null
    try {
      response = await this.$http.$get('api/auth/refresh')
      commit('setToken', response.accessToken)
    } catch (e) {
      if(state.token) {
        this.$router.push('/auth?session=expired')
        commit('setToken', null)
      }
      commit('clearInterval')
    }
    return response
  },

  startTimer({ dispatch, commit }) {
    // Refresh token every 10 minutes
    const interval = setInterval(() => { dispatch('refreshToken') }, 10 * 6 * 10000)
    commit('setInterval', interval)
  }
}
