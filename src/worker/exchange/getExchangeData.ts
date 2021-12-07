import { AxiosInstance } from "axios"

const getExchangeData = async (exchangeSelected: string, api: AxiosInstance) => {
  console.log(`[coinway-balance] Exchange selected: ${exchangeSelected}`)
  console.log(`[coinway-balance] ${exchangeSelected} - Searching exchange data ...`)
  const exchangeData = await api.get(`exchange/select?exchangeKey=${exchangeSelected}`)
    .then(response => response.data[0])
    .catch(error => {
      console.log(error.message)
    })
  global.detailedConsole && console.log(`[coinway-balance] ${exchangeSelected} - Search exchange done`)
  global.detailedConsole && console.log(exchangeData)
  global.detailedConsole && console.log('\n')

  return exchangeData
}

export default getExchangeData