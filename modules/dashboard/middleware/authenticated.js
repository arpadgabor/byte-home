export default function ({ store, redirect }) {
  const token = store.state.token

  if(!token) {
    return redirect('/auth?unautorhized=true')
  }
}
