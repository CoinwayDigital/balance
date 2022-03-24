import { AxiosInstance } from "axios"

const getInvestmentData = async (api: AxiosInstance, usdBrlPrice: number): Promise<TInvestmentData> => {

  const investmentsResponse = await api.get('investment/select?status=active')
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.log(error.message)
    })

  let investmentsAmountUsd = 0
  let investmentsAmountBrl = 0

  for (let i = 0; i < investmentsResponse.length; i++) {
    if (investmentsResponse[i].amount_usd && investmentsResponse[i].usd_brl_price) {
      investmentsAmountBrl = investmentsAmountBrl + (investmentsResponse[i].amount_usd * investmentsResponse[i].usd_brl_price)
    }
  }

  investmentsAmountUsd = investmentsAmountBrl / usdBrlPrice

  return {
    investmentsAmountUsd,
    investmentsAmountBrl
  }
}

export default getInvestmentData