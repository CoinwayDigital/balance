import mailer from "@src/utils/mailer"
import { AxiosInstance } from "axios"
import dayjs from "dayjs"

const getExchangeData = async (exchangeSelected: string, api: AxiosInstance) => {
  console.log(`[araucaria-balance] Exchange selected: ${exchangeSelected}`)
  console.log(`[araucaria-balance] ${exchangeSelected} - Searching exchange data ...`)
  const exchangeData = await api.get(`exchange/select?exchangeKey=${exchangeSelected}`)
  .then(response => response.data[0])
  .catch(error => {
    console.log(error.message)
  })

  if(!exchangeData){
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
            console.log(`[araucaria-balance] ${exchangeSelected} - Error to get exchange data`)
            console.log(mailerResponse)
            return lastBalance.balance.exchanges[exchangeSelected]
          }
        }
      }
    } 
  }
  
  global.detailedConsole && console.log(`[araucaria-balance] ${exchangeSelected} - Search exchange done`)
  global.detailedConsole && console.log(exchangeData)
  global.detailedConsole && console.log('\n')

  return exchangeData
}

export default getExchangeData