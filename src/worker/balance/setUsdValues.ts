import { AxiosInstance } from "axios"

const setUsdValues = async (exchangeSelected: string, filteredBalance: Balances) => {
  // Para retornar a soma de todos os valores em USD encontrados
  let usdValueTotal: number = 0

  console.log(`[araucaria-balance] ${exchangeSelected} - Serching USD Values ...`)

  global.detailedConsole && console.log(`[araucaria-balance] ${exchangeSelected} - Serch USD Values done`)
  global.detailedConsole && console.log('\n')

  console.log(`[araucaria-balance] ${exchangeSelected} - Setting USD Values ...`)

  for (const b in filteredBalance) {
    usdValueTotal = usdValueTotal + filteredBalance[b].usdValue
  }

  global.detailedConsole && console.log(`[araucaria-balance] ${exchangeSelected} - Set USD Values done`)
  return {
    filteredBalance,
    usdValueTotal
  }
}

export default setUsdValues