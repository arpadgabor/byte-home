export const state = () => ({
  name: undefined,
})

export const mutations = {
  open(state, modal) {
    state.name = modal.name || modal
    state.title = modal.title
  },
  close(state) {
    state.name = null
    state.title = null
  }
}
