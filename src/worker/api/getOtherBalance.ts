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

  const filterOtherBalance = []

  for (let i = 0; i < apiResponse.length; i++) {
    filterOtherBalance.push({
      id: apiResponse[i].id,
      date: apiResponse[i].date,
      label: apiResponse[i].label,
      status: apiResponse[i].status,
      amount: apiResponse[i].amount,
      netAmount: apiResponse[i].netAmount,
      currency: apiResponse[i].currency,
      obs: apiResponse[i].obs
    })
  }

  return filterOtherBalance
}

export default getOtherBalance