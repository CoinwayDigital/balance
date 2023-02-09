import { AxiosInstance } from "axios"
import getCoinPrice from "../api/getCoinPrice"
import getOtherBalance from "../api/getOtherBalance"

type TStatus = 'active' | 'disabled'

type TOtherBalance = {
  id: string
  date: Date
  label: string
  status: TStatus
  amount: number
  netAmount: number
  currency: string
  obs?: string
}

const getOtherBalanceData = async (api: AxiosInstance) => {
  console.log('[araucaria-balance] binance - Get other balances ...')
  const otherBalanceResponse: Array<TOtherBalance> = await getOtherBalance(api)

  console.log('[araucaria-balance] binance - Get USD/BRL price ...')
  const usdBrlPrice = await getCoinPrice('tether', 'brl', api)
    .then(response => {
      // return response.tether.brl * 1.01
      return response.tether.brl
    })
    .catch(error => {
      console.log(error.message)
      return null
    })

  // Filtrando os Other Balances ativos
  const otherBalanceActive = otherBalanceResponse.filter(o => o.status === 'active')

  if (usdBrlPrice) {
    let sumUsdAmount = 0
    let sumBrlAmount = 0
    let sumUsdNetAmount = 0
    let sumBrlNetAmount = 0
    const otherBalanceUsdConvert = []
    for (let i = 0; i < otherBalanceActive.length; i++) {
      if(otherBalanceActive[i].status === 'active'){
        if (otherBalanceActive[i].currency === 'brl') {
          sumUsdAmount = (sumUsdAmount + (otherBalanceActive[i].amount / usdBrlPrice))
          sumBrlAmount = sumBrlAmount + otherBalanceActive[i].amount
          sumUsdNetAmount = (sumUsdNetAmount + (otherBalanceActive[i].netAmount / usdBrlPrice))
          sumBrlNetAmount = sumBrlNetAmount + otherBalanceActive[i].netAmount
          otherBalanceUsdConvert.push({
            ...otherBalanceActive[i],
            amount: otherBalanceActive[i].amount / usdBrlPrice,
            netAmount: otherBalanceActive[i].netAmount / usdBrlPrice,
            currency: 'usd'
          })
        } else if (otherBalanceActive[i].currency === 'usd') {
          sumUsdAmount = sumUsdAmount + otherBalanceActive[i].amount
          sumBrlAmount = (sumBrlAmount + (otherBalanceActive[i].amount * usdBrlPrice))
          sumUsdNetAmount = sumUsdNetAmount + otherBalanceActive[i].netAmount
          sumBrlNetAmount = (sumBrlNetAmount + (otherBalanceActive[i].netAmount * usdBrlPrice))
          otherBalanceUsdConvert.push(otherBalanceActive[i])
        }
      }
    }

    const otherBalance = {
      status: 'success',
      message: 'OK',
      currencyAmount: {
        usd: sumUsdAmount,
        brl: sumBrlAmount
      },
      currencyNetAmount: {
        usd: sumUsdNetAmount,
        brl: sumBrlNetAmount
      },
      otherBalance: otherBalanceActive,
      otherBalanceUsdConvert
    }

    return otherBalance
  }

  return {
    status: 'error',
    message: 'USD/BRL price not received'
  }
}

export default getOtherBalanceData