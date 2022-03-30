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
import getSolanaBalance from './solana/getSolanaBalance'
import getOtherBalanceData from './otherBalance/getOtherBalanceData'
import getPriceUsdBrl from './priceUsdBrl/getPriceUsdBrl'
import getInvestmentData from './investment/getInvestmentData'

global.authenticateData = undefined
global.detailedConsole = false

const getBalance = async (exchangeSelected: string, api: AxiosInstance) => {
  const exchangeData = await getExchangeData(exchangeSelected, api)
  const coinList = await getCoinSelect(exchangeSelected, api)
  let filteredBalance = await fetchExchangeBalance(exchangeData, exchangeSelected, api)
  const { filteredBalanceWithIds, filteredBalanceIds } = await setCoingeckoIds(exchangeSelected, filteredBalance, coinList)
  const finalBalance = await setUsdValues(exchangeSelected, filteredBalanceWithIds, filteredBalanceIds, api)
  console.log(`[araucaria-balance] Final balance of ${exchangeSelected}\n`)
  return finalBalance
}

const loopBalance = async () => {
  console.log('\n')
  console.log(`[araucaria-balance] Login Araucaria API ...`)
  await loginApi()
  const api = coinwayApi()
  global.detailedConsole && console.log(`[araucaria-balance] Login Done`)
  await checkerExpire() // Check authentication


  // Inicio do levantamento de Balance das Exchanges
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
  // Final do Balance das Exchanges

  // Inicio do levantamento de Outros Saldos
  const otherBalance = await getOtherBalanceData(api)

  const solanaBalance = undefined // await getSolanaBalance(api, process.env.SOLANA_WALLET)

  const priceUsdBrl = await getPriceUsdBrl(api)

  const investmentsAmount = await getInvestmentData(api, priceUsdBrl ? priceUsdBrl : 1)

  return {
    balance,
    api,
    solanaBalance,
    otherBalance,
    priceUsdBrl,
    investmentsAmountUsd: investmentsAmount.investmentsAmountUsd,
    investmentsAmountBrl: investmentsAmount.investmentsAmountBrl
  }

}

const main = async () => {
  console.clear()
  console.log('|||| Araucária Capital - Balance Project ||||')
  while (true) {
    const { balance, api, solanaBalance, otherBalance, priceUsdBrl, investmentsAmountUsd, investmentsAmountBrl } = await loopBalance()
    const newBalance = await setBalance(balance, api, solanaBalance, otherBalance, (priceUsdBrl ? priceUsdBrl : 1), investmentsAmountUsd, investmentsAmountBrl)
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