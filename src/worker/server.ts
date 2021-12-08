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
import sleep from '@src/utils/sleep'
import setBalance from './api/setBalance'

global.authenticateData = undefined
global.detailedConsole = false

const getBalance = async (exchangeSelected: string, api: AxiosInstance) => {
  const exchangeData = await getExchangeData(exchangeSelected, api)
  const coinList = await getCoinSelect(exchangeSelected, api)
  let filteredBalance = await fetchExchangeBalance(exchangeData, exchangeSelected, api)
  const { filteredBalanceWithIds, filteredBalanceIds } = await setCoingeckoIds(exchangeSelected, filteredBalance, coinList)
  const finalBalance = await setUsdValues(exchangeSelected, filteredBalanceWithIds, filteredBalanceIds, api)
  console.log(`Final balance of ${exchangeSelected}`)
  return finalBalance
}

const loopBalance = async () => {
  console.log('\n')
  console.log(`[coinway-balance] Login Coinway API ...`)
  await loginApi()
  const api = coinwayApi()
  global.detailedConsole && console.log(`[coinway-balance] Login Done`)
  await checkerExpire()

  const exchangeKeys = await getExchangeKeys(api)

  let exchangesBalance: object = {}
  let usdTotal: number = 0

  for (let i = 0; i < exchangeKeys.length; i++) {
    exchangesBalance[exchangeKeys[i]] = await getBalance(exchangeKeys[i], api)
  }

  for (const b in exchangesBalance) {
    usdTotal = usdTotal + exchangesBalance[b].usdValueTotal
  }

  const balance = {
    exchanges: exchangesBalance,
    usdTotal
  }

  return {
    balance,
    api
  }

}

const main = async () => {
  console.clear()
  console.log('|||| Araucária Capital - Balance Project ||||')
  while (true) {
    const { balance, api } = await loopBalance()
    const newBalance = await setBalance(balance, api)
    if (newBalance) {
      console.log('New Balance create success!')
      console.log(newBalance)
    } else {
      console.log('Error to save new balance')
    }
    await sleep(parseInt(process.env.LOOP))
  }
}

main()