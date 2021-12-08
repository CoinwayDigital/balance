import { AxiosInstance } from "axios"

const setBalance = async (balance: any, api: AxiosInstance): Promise<any> => {

  const apiResponse = await api.post('balance/create', {
    balance: balance
  })
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.log(error)
      return undefined
    })

  return apiResponse
}

export default setBalance