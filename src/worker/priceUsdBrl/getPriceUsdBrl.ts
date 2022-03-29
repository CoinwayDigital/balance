import { AxiosInstance } from "axios"

const getPriceUsdBrl = async (api: AxiosInstance) => {
  const coinPrices = await api.get(`coin/price?ids=tether&vsCurrencies=brl`)
    .then(response => {
      return (response.data.tether.brl * 1.01)
    })
    .catch(error => {
      console.log(error.message)
    })

  return coinPrices
}

export default getPriceUsdBrl