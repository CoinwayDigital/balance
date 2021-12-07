import coinwayApi from '../services/axios/api'
import loginApi from '../utils/authenticateApi/login'
import checkerExpire from '../utils/authenticateApi/checkerExpire'
import getExchangeData from './exchange/getExchangeData'
import fetchExchangeBalance from './exchange/fetchExchangeBalance'
import getCoinSelect from './coin/getCoinSelect'
import setCoingeckoIds from './balance/setCoingeckoIds'
import setUsdValues from './balance/setUsdValues'
import { AxiosInstance } from 'axios'
import getExchangeKeys from './exchange/getExchangeKeys'

global.authenticateData = undefined
global.detailedConsole = false

const getBalance = async (exchangeSelected: string, api: AxiosInstance) => {

  const exchangeData = await getExchangeData(exchangeSelected, api)

  const coinList = await getCoinSelect(exchangeSelected, api)

  let filteredBalance = await fetchExchangeBalance(exchangeData, exchangeSelected, api)

  const { filteredBalanceWithIds, filteredBalanceIds } = await setCoingeckoIds(exchangeSelected, filteredBalance, coinList)

  const finalBalance = await setUsdValues(exchangeSelected, filteredBalanceWithIds, filteredBalanceIds, api)

  console.log(`Final balance of ${exchangeSelected}`)

  //Somar os valores em dólar

  return {
    balance: finalBalance,
    usdTotal: 1
  }

}

const main = async () => {
  console.clear()
  console.log(`[coinway-balance] Login Coinway API ...`)
  await loginApi()
  const api = coinwayApi()
  global.detailedConsole && console.log(`[coinway-balance] Login Done`)
  console.log('\n')
  await checkerExpire()

  const exchangeKeys = await getExchangeKeys(api)

  let balance: object = {}

  for (let i = 0; i < exchangeKeys.length; i++) {
    balance[exchangeKeys[i]] = await getBalance(exchangeKeys[i], api)
  }

  console.log(balance)
}
main()