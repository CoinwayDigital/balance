import coinwayApi from "@src/services/axios/api"

const api = coinwayApi()

const loginApi = async () => {
  const login = await api.post('authenticate/login', {
    username: process.env.API_USERNAME,
    password: process.env.API_PASSWORD
  })
    .then(response => {
      global.authenticateData = response.data
      return response.data
    })
    .catch(error => {
      console.log(error.message)
    })

  api.defaults.headers['Authorization'] = `Bearer ${login.token}`

  return login ? true : false
}

export default loginApi