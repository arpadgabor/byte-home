import { api } from '@/utils/constants'
import { setAuthHeader } from '@/utils/helpers'

export const state = () => ({
  token: null,
  authHeader: null,
  interval: null,
  user: null,
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
  },
  setUser(state, user) {
    state.user = user
  }
}

export const actions = {
  async refreshToken({ state, commit }) {
    let response = null
    try {
      response = await this.$http.$get(api.public.getAuthRefresh)
      commit('setToken', response.accessToken)
    } catch (e) {
      commit('clearInterval')

      if(state.token) {
        this.$router.push('/auth?session=expired')
        commit('setToken', null)
      }
    }
    return response
  },

  startTimer({ dispatch, commit }) {
    // Refresh token every 10 minutes
    const interval = setInterval(() => { dispatch('refreshToken') }, 10 * 6 * 10000)
    commit('setInterval', interval)
  },

  async getUser({ state, commit }) {
    const user = await this.$http.$get(api.private.getUsersMe, setAuthHeader(state.token))
    commit('setUser', user)
  }
}
