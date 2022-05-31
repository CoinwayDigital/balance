import { AxiosInstance } from "axios"

const setBalance = async (
  balance: any,
  api: AxiosInstance,
  solanaBalance?: any,
  otherBalance?: any,
  priceUsdBrl?: number,
  investmentsAmountUsd?: number,
  investmentsAmountBrl?: number,
  cashbookReport?: any): Promise<any> => {
  const apiResponse = await api.post('balance/create', {
    balance: balance,
    solanaBalance: solanaBalance,
    otherBalance: otherBalance,
    priceUsdBrl: priceUsdBrl,
    investmentsAmountUsd: investmentsAmountUsd,
    investmentsAmountBrl: investmentsAmountBrl,
    book: cashbookReport
  })
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.log(error)
      return undefined
    })

  return apiResponse
}

export default setBalance