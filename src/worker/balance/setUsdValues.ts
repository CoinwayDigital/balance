import { AxiosInstance } from "axios"

const setUsdValues = async (exchangeSelected: string, filteredBalance: Balances, filteredBalanceIds: string, api: AxiosInstance) => {
  console.log(`[coinway-balance] ${exchangeSelected} - Serching USD Values ...`)
  const coinPrices = await api.get(`coin/price?ids=${filteredBalanceIds}&vsCurrencies=usd`)
    .then(response => response.data)
    .catch(error => {
      console.log(error.message)
    })

  global.detailedConsole && console.log(`[coinway-balance] ${exchangeSelected} - Serch USD Values done`)
  global.detailedConsole && console.log('\n')

  console.log(`[coinway-balance] ${exchangeSelected} - Setting USD Values ...`)
  for (const b in filteredBalance) {
    for (const c in coinPrices) {

      // Verificando se a moeda é dolar, pois para evitar incossistencias vamos
      // garantir que o valor seja sempre 1
      const dolarList = ['usd', 'usdc', 'usdt']
      const dolarCorrection = dolarList.includes(b.toLowerCase())

      if (filteredBalance[b].coinGeckoId === c) {
        filteredBalance[b] = dolarCorrection ? {
          ...filteredBalance[b],
          usdValue: 1 * filteredBalance[b].total,
          coinGeckoId: 'stable-dollar'
        } : {
          ...filteredBalance[b],
          usdValue: coinPrices[c].usd * filteredBalance[b].total
        }
      }
    }
  }
  global.detailedConsole && console.log(`[coinway-balance] ${exchangeSelected} - Set USD Values done`)
  return filteredBalance
}

export default setUsdValues