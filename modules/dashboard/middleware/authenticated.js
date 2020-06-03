export default function ({ store, redirect }) {
  const token = store.state.auth.token

  if(!token) {
    return redirect('/auth?unautorhized=true')
  }
}
