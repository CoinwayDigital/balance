import axios from 'axios'

const coinwayApi = () => {
  const api = axios.create({
    baseURL: process.env.API_URL
  })

  if (global.authenticateData) {
    api.defaults.headers['Authorization'] = `Bearer ${global.authenticateData.token}`
  }


  return api
}

export default coinwayApi
