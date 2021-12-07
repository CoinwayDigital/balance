import { AxiosInstance } from "axios"

const getExchangeKeys = async (api: AxiosInstance) => {

  const exchanges = await api.get(`exchange/select`)
    .then(response => response.data)
    .catch(error => {
      console.log(error.message)
    })

  const exchangeKeys = exchanges.map(exchange => {
    return exchange.exchange_key
  })

  return exchangeKeys

}

export default getExchangeKeys