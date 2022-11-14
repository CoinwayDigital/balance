import { decrypt } from "@src/utils/crypto-js"
import { AxiosInstance } from "axios"
import ccxt from 'ccxt'
import dayjs from "dayjs"
import getLockExchanges from "../settings/getLockExchanges"

const sendMail = async (api: AxiosInstance, exchangeSelected: string, message: string) => {
  const mailerResponse = await api.post('sender/email/create', {
    "to": 'ti@araucariacapital.com.br',
    "subject": `Alerta técnico - Araucária Capital - Serviço: Balance - fetchExchangeBalance ${exchangeSelected} ${dayjs().format('DD/MM/YYYY hh:mm')}`,
    "body": message
    // "body": `Erro ao puxar dados da exchange ${exchangeSelected}, foi utilizando os dados salvos anteriormente no Balance`
  })

  console.log(`[araucaria-balance] ${exchangeSelected} - Error to get exchange data, restore old data in balance with success!`)
  console.log(mailerResponse.data)
}

const getLastBalance = async (exchangeSelected: string, api: AxiosInstance) => {
  const lastBalance = await api.get('balance/select?orderBy=desc&limit=1')
    .then(response => response.data[0])
    .catch(error => {
      console.log(error.message)
    })
    if(lastBalance){
      if(lastBalance.balance){
        if(lastBalance.balance.exchanges){
          if(lastBalance.balance.exchanges[exchangeSelected]){
            if(lastBalance.balance.exchanges[exchangeSelected].filteredBalance){
              return lastBalance.balance.exchanges[exchangeSelected].filteredBalance
            } else {
              console.log('[araucaria-balance] In get last balance exchange, error on lastBalance.balance.exchanges[exchangeSelected].filteredBalance already exists')
            }
          } else {
            console.log('[araucaria-balance] In get last balance exchange, error on lastBalance.balance.exchanges[exchangeSelected] already exists')
          }
        } else {
          console.log('[araucaria-balance] In get last balance exchange, error on lastBalance.balance.exchanges already exists')
        }
      } else {
        console.log('[araucaria-balance] In get last balance exchange, error on lastBalance.balance already exists')
      }
    } else {
      console.log('[araucaria-balance] In get last balance exchange, error on lastBalance already exists')
    }
}


const fetchExchangeBalance = async (exchangeData, exchangeSelected: string, api: AxiosInstance, status: boolean) => {

  if(exchangeData.status === 'disabled'){
    console.log(`[araucaria-balance] ${exchangeSelected} - Exchange Disabled`)
    return {}
  }

  const settingLockExchanges = await getLockExchanges(api)

  const exchange = new ccxt[exchangeSelected]({
    apiKey: decrypt(exchangeData.api_public),
    secret: decrypt(exchangeData.api_secret)
  })

  let balanceList


  console.log(`[araucaria-balance] ${exchangeSelected} - Searching last exchange balance in BD ...`)
  const lastBalance = await getLastBalance(exchangeSelected, api)

  if(!!settingLockExchanges){
    console.log(`[araucaria-balance] ${exchangeSelected} - Lock exchange data enabled`)
    if(lastBalance){
      balanceList = lastBalance
    } else {
      status = false
      sendMail(api, exchangeSelected, 'Entrou na condição de exchange travadas, mas não conseguiu buscar o resultado anterior')
    }
  }

  let filteredBalance: Balances = {}

  if(!settingLockExchanges){
    console.log(`[araucaria-balance] ${exchangeSelected} - Searching exchange balance in exchange ...`)
    await exchange.fetchBalance()
    .then(response => {
      balanceList = response
    })
    .catch(async error => {
      sendMail(api, exchangeSelected, `Erro ao buscar os dados na exchange, será usado o ultimo balanço salvo, erro: ${error.message}`)
      console.log(`[araucaria-balance] ${exchangeSelected} - Error to get exchange data, get old data in last balance ...`)
      balanceList = lastBalance
    })
    global.detailedConsole && console.log(`[araucaria-balance] ${exchangeSelected} - Search balance done`)
    if(balanceList){
      console.log(`[araucaria-balance] ${exchangeSelected} - Filter non zero balances ...`)
      for (const key in balanceList) {
        if (balanceList.total[key] > 0) {
          filteredBalance[key] = {
            total: balanceList.total[key],
            free: balanceList.free[key],
            used: balanceList.used[key]
          }
        }
      }
    } else {
      console.log(`[araucaria-balance] ${exchangeSelected} - Balance not found (last balance or exchange balance)`)
      status = false
    }
  } else {
    filteredBalance = balanceList
  }

  global.detailedConsole && console.log(`[araucaria-balance] ${exchangeSelected} - Filter balance done`)
  global.detailedConsole && console.log(filteredBalance)
  global.detailedConsole && console.log('\n')
  	
  return filteredBalance
}

export default fetchExchangeBalance