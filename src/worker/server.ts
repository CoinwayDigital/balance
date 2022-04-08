import coinwayApi from '../services/axios/api'
import loginApi from '../utils/authenticateApi/login'
import checkerExpire from '../utils/authenticateApi/checkerExpire'
import getExchangeData from './exchange/getExchangeData'
import fetchExchangeBalance from './exchange/fetchExchangeBalance'
import getExchangeCoinPrice from './exchange/getExchangeCoinPrice'
import getCoinSelect from './coin/getCoinSelect'
import setCoingeckoIds from './balance/setCoingeckoIds'
import setUsdValues from './balance/setUsdValues'
import { AxiosInstance } from 'axios'
import getExchangeKeys from './exchange/getExchangeKeys'
import sleep from '@src/utils/sleep'
import setBalance from './api/setBalance'
// import getSolanaBalance from './solana/getSolanaBalance'
import getOtherBalanceData from './otherBalance/getOtherBalanceData'
import getPriceUsdBrl from './priceUsdBrl/getPriceUsdBrl'
import getInvestmentData from './investment/getInvestmentData'

global.authenticateData = undefined
global.detailedConsole = false

const getBalance = async (exchangeSelected: string, api: AxiosInstance) => {
  const exchangeData = await getExchangeData(exchangeSelected, api)
  const coinList = await getCoinSelect(exchangeSelected, api)
  let filteredBalance = await fetchExchangeBalance(exchangeData, exchangeSelected, api)
  const exchangeCoinPrice = await getExchangeCoinPrice(exchangeSelected, filteredBalance, api)
  // Se ele não conseguir encontrar qualquer valor de saldo em qualquer exchange, é interrompido o loop do balance
  if(exchangeCoinPrice){
    // const { filteredBalanceWithIds, filteredBalanceIds } = await setCoingeckoIds(exchangeSelected, filteredBalance, coinList)
    const finalBalance = await setUsdValues(exchangeSelected, filteredBalance)
    console.log(`[araucaria-balance] Final balance of ${exchangeSelected}`)
    return finalBalance
  } else {
    console.log(`[araucaria-balance] ${exchangeSelected} - Error to found some balance value`)
  }
}

const loopBalance = async () => {
  console.log('\n')
  console.log(`[araucaria-balance] Login Araucaria API ...`)
  await loginApi()
  const api = coinwayApi()
  global.detailedConsole && console.log(`[araucaria-balance] Login Done`)
  await checkerExpire() // Check authentication

  let status = true

  // Inicio do levantamento de Balance das Exchanges
  const exchangeKeys = await getExchangeKeys(api)

  let exchangesBalance: object = {}
  let usdTotal: number = 0

  for (let i = 0; i < exchangeKeys.length; i++) {
    exchangesBalance[exchangeKeys[i]] = await getBalance(exchangeKeys[i], api)

    if(!exchangesBalance[exchangeKeys[i]]){
      status = false
      break
    }
  }

  if(status){
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
      status,
      balance,
      api,
      solanaBalance,
      otherBalance,
      priceUsdBrl,
      investmentsAmountUsd: investmentsAmount.investmentsAmountUsd,
      investmentsAmountBrl: investmentsAmount.investmentsAmountBrl
    }
  }

  // Quando encontrar algum erro em alguma exchange
  return {
    status
  }
}

const main = async () => {
  console.clear()
  console.log('|||| Araucária Capital - Balance Project ||||')

  while (true) {
    const { status, balance, api, solanaBalance, otherBalance, priceUsdBrl, investmentsAmountUsd, investmentsAmountBrl } = await loopBalance()
    if(status){
      const newBalance = await setBalance(balance, api, solanaBalance, otherBalance, (priceUsdBrl ? priceUsdBrl : 1), investmentsAmountUsd, investmentsAmountBrl)
      if (newBalance) {
        console.log('[araucaria-balance] New Balance create success!')
        console.log(newBalance)
      } else {
        console.log('[araucaria-balance] Error to save new balance')
      }
    } else {
      console.log('[araucaria-balance] Error to get some balance')
    }
    console.log('[araucaria-balance] END LOOP')
    await sleep(parseInt(process.env.LOOP))
  }
}

main()