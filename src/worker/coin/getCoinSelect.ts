import { AxiosInstance } from "axios"

const getCoinSelect = async (exchangeSelected: string, api: AxiosInstance) => {
  console.log(`[araucaria-balance] ${exchangeSelected} - Get list coins ...`)
  const coinList: Array<Coin> = await api.get('/coin/select')
    .then(response => response.data)
    .catch(error => {
      console.log(error.message)
    })

  global.detailedConsole && console.log(`[araucaria-balance] ${exchangeSelected} - List coins done, length list: ${coinList.length}`)
  global.detailedConsole && console.log('\n')
  return coinList
}

export default getCoinSelect