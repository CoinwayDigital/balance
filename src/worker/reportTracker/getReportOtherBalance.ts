import { AxiosInstance } from "axios"

const getReportOtherBalance = async (api: AxiosInstance) => {
  console.log('[araucaria-balance] Update report tracking on Other Balance')
  await api.put('other-balance/report/update')
    .then(response => {
      console.log('[araucaria-balance] Report tracker response ...')
      console.log(response.data)
    })
    .catch(error => {
      console.log('[araucaria-balance] Error on Report Tracker ...')
      console.log(error)
    })
}

export default getReportOtherBalance