import { AxiosInstance } from "axios"

const getPriceUsdBrl = async (api: AxiosInstance) => {
  const coinPrices = await api.get(`coin/price?ids=tether&vsCurrencies=brl`)
    .then(response => {
      return (response.data.tether.brl * 1.01)
    })
    .catch(error => {
      console.log(error.message)
    })

  if(!coinPrices){
    console.log(`[araucaria-balance] ERROR to get usd price on Coingecko API, use last price save in Balance`)
    const lastBalanceResponse = await api.get('balance/select?&orderBy=desc&limit=1&groupBy=hour')
    console.log(`[araucaria-balance] Substitute price to USD on getPriceUsdBrl ${lastBalanceResponse.data[0].price_usd_brl}`)
    return lastBalanceResponse.data[0].price_usd_brl
  }
  return coinPrices
}

export default getPriceUsdBrl