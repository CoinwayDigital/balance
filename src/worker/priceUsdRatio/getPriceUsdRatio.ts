import { AxiosInstance } from "axios"

const getPriceUsdRatio = async (api: AxiosInstance) => {

  const bookReport = await api.get('book/report/select')
  .then(response => {
      return (response.data)
  })
  .catch(error => {
      console.log(error.message)
  })

  // console.log(bookReport)

  return bookReport.usdRatioPrice
}

export default getPriceUsdRatio