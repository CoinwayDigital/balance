import { AxiosInstance } from "axios"

const getOtherBalance = async (api: AxiosInstance): Promise<any> => {

  const apiResponse = await api.get('other-balance/select')
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.log(error)
      return undefined
    })

  return apiResponse
}

export default getOtherBalance