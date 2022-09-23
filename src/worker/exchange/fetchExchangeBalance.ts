import { decrypt } from "@src/utils/crypto-js"
import mailer from "@src/utils/mailer"
import { AxiosInstance } from "axios"
import ccxt from 'ccxt'
import dayjs from "dayjs"

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
    .catch(async error => {
      console.log(error.message)
      console.log(`[araucaria-balance] ${exchangeSelected} - Error to get exchange data, get old data in last balance ...`)
      const lastBalance = await api.get('balance/select?orderBy=desc&limit=1')
      .then(response => response.data[0])
      .catch(error => {
        console.log(error.message)
      })
  
      if(lastBalance){
        if(lastBalance.balance){
          if(lastBalance.balance.exchanges){
            if(lastBalance.balance.exchanges[exchangeSelected]){
              const mailerResponse = await mailer(
                'ti@araucariacapital.com.br',
                `Alerta técnico - Araucária Capital - Serviço: Balance - Erro API ${exchangeSelected} ${dayjs().format('DD/MM/YYYY hh:mm')}`,
                `Erro ao puxar dados da exchange ${exchangeSelected}, foi utilizando os dados salvos anteriormente no Balance`
              )
              console.log(`[araucaria-balance] ${exchangeSelected} - Error to get exchange data, restore old data in balance with success!`)
              console.log(mailerResponse)
              return lastBalance.balance.exchanges[exchangeSelected]
            }
          }
        }
      } 
    })

    

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

  global.detailedConsole && console.log(`[araucaria-balance] ${exchangeSelected} - Filter balance done`)
  global.detailedConsole && console.log(filteredBalance)
  global.detailedConsole && console.log('\n')

  return filteredBalance
}

export default fetchExchangeBalance