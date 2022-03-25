import { decrypt } from "@src/utils/crypto-js"
import { AxiosInstance } from "axios"
import ccxt from 'ccxt'

const fetchExchangeBalance = async (exchangeData, exchangeSelected: string, api: AxiosInstance) => {
  const exchange = new ccxt[exchangeSelected]({
    apiKey: decrypt(exchangeData.api_public),
    secret: decrypt(exchangeData.api_secret)
  })

  console.log(`[araucaria-balance] ${exchangeSelected} - Searching exchange balance ...`)
  const balance = await exchange.fetchBalance()
    .then(response => {
      return response
    })
    .catch(error => {
      console.log(error.message)
      return null
    })

  const nativeBalance = balance.info.result ? balance.info.result as Array<any> : []

  global.detailedConsole && console.log(`[araucaria-balance] ${exchangeSelected} - Search balance done`)
  global.detailedConsole && console.log('\n')

  console.log(`[araucaria-balance] ${exchangeSelected} - Filter non zero balances ...`)
  let filteredBalance: Balances = {}

  for (const key in balance) {
    if (balance.total[key] > 0) {
      filteredBalance[key] = {
        total: balance.total[key],
        free: balance.free[key],
        used: balance.used[key]
      }
    }
  }

  if (nativeBalance) {
    for (let i = 0; i < nativeBalance.length; i++) {
      if (nativeBalance[i].coin in filteredBalance) {
        filteredBalance[nativeBalance[i].coin] = {
          ...filteredBalance[nativeBalance[i].coin],
          usdValue: parseFloat(nativeBalance[i].usdValue)
        }
      }
    }
  }

  global.detailedConsole && console.log(`[araucaria-balance] ${exchangeSelected} - Filter balance done`)
  global.detailedConsole && console.log(filteredBalance)
  global.detailedConsole && console.log('\n')

  return filteredBalance
}

export default fetchExchangeBalance