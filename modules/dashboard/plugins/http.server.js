export default function ({ $http, store }) {
  $http.onError(error => {
    console.log(error)
  })
}
