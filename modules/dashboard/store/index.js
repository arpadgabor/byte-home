export const state = () => ({
})

export const mutations = {
}

export const actions = {
  async nuxtServerInit({ state, dispatch }) {
    await dispatch('auth/refreshToken')

    if(state.auth.token) {
      await dispatch('auth/getUser')
    }
  }
}
