export const state = () => ({
  name: undefined,
})

export const mutations = {
  open(state, name) {
    state.name = name
  },
  close(state) {
    state.name = null
  }
}
