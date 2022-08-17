import { AxiosInstance } from "axios"

const getCoinPrice = async (coinGeckoIds: string, symbols: string, api: AxiosInstance): Promise<any> => {

  const apiResponse = await api.get(`coin/price?ids=${coinGeckoIds}&vsCurrencies=${symbols}`)
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.log(error.message)
      return undefined
    })

  if(symbols === 'brl'){
    if(!apiResponse){
      console.log(`[araucaria-balance] ERROR to get usd price on Coingecko API, use last price save in Balance`)
      const lastBalanceResponse = await api.get('balance/select?&orderBy=desc&limit=1&groupBy=hour')
      console.log(`[araucaria-balance] Substitute price to USD on getCoinPrice ${lastBalanceResponse.data[0].price_usd_brl}`)
      return {
        tether: {
          brl: lastBalanceResponse.data[0].price_usd_brl
        }
      }
      // return lastBalanceResponse.data[0].price_usd_brl
    }
  }

  return apiResponse
}

export default getCoinPrice