import { AxiosInstance } from "axios"

const getInvestmentData = async (api: AxiosInstance, usdBrlPrice: number): Promise<TInvestmentData> => {



  const bookResponse = await api.get('book/select?status=active')
  .then(response => {
    return response.data
  })
  .catch(error => {
    console.log(error.message)
  })

  let bookAmountUsd = 0
  let bookAmountBrl = 0

  for (let i = 0; i < bookResponse.length; i++) {
    if (bookResponse[i].ratio && bookResponse[i].usdRatioPrice && bookResponse[i].usdBrlPrice) {
      bookAmountBrl = bookAmountBrl + (bookResponse[i].ratio / (bookResponse[i].usdRatioPrice / bookResponse[i].usdBrlPrice))
      bookAmountUsd = bookAmountUsd + (bookResponse[i].ratio / bookResponse[i].usdRatioPrice)
    }
  }

  // console.log({
  //   bookAmountUsd,
  //   bookAmountBrl
  // })

  // Antigo calculo baseado no banco de dados de investimento, que foi descontinuado
  // const investmentsResponse = await api.get('investment/select?status=active')
  //   .then(response => {
  //     return response.data
  //   })
  //   .catch(error => {
  //     console.log(error.message)
  //   })

  // let investmentsAmountUsd = 0
  // let investmentsAmountBrl = 0

  // for (let i = 0; i < investmentsResponse.length; i++) {
  //   if (investmentsResponse[i].amount_usd && investmentsResponse[i].usd_brl_price) {
  //     investmentsAmountBrl = investmentsAmountBrl + (investmentsResponse[i].amount_usd * investmentsResponse[i].usd_brl_price)
  //     investmentsAmountUsd = investmentsAmountUsd + investmentsResponse[i].amount_usd
  //   }
  // }

  return {
    investmentsAmountUsd: bookAmountUsd,
    investmentsAmountBrl: bookAmountBrl
  }
}

export default getInvestmentData