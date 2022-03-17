import { AxiosInstance } from "axios"

const getCoinPrice = async (coinGeckoIds: string, symbols: string, api: AxiosInstance): Promise<any> => {

  const apiResponse = await api.get(`coin/price?ids=${coinGeckoIds}&vsCurrencies=${symbols}`)
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.log(error)
      return undefined
    })

  return apiResponse
}

export default getCoinPrice