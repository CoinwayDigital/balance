import { AxiosInstance } from "axios"
import dayjs from "dayjs"

const getPriceUsdBrl = async (api: AxiosInstance) => {
  const coinPrices = await api.get(`coin/price?ids=tether&vsCurrencies=brl`)
    .then(response => {
      return (response.data.tether.brl * 1.01)
    })
    .catch(async error => {
      console.log(error.message)
      const mailerResponse = await api.post('sender/email/create', {
        "to": 'ti@araucariacapital.com.br',
        "subject": `Alerta técnico - Araucária Capital - Serviço: Balance - Erro API Coingecko ${dayjs().format('DD/MM/YYYY hh:mm')}`,
        "body": `Erro ao puxar preço da moeda pela API da Coingecko, endpoint: coin/price?ids=tether&vsCurrencies=brl, retorno: ${error.message}`
      })
      console.log(mailerResponse.data)
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