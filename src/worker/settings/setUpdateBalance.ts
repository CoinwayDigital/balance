import { AxiosInstance } from 'axios'
import coinwayApi from '../../services/axios/api'
const api = coinwayApi()

const setUpdateBalance = async (api: AxiosInstance, isUpdateBalance: boolean): Promise<boolean> => {
  const apiResponse = await api.put('settings/update/balance/update', {
    updateBalance: isUpdateBalance
  })
  .then(response => {
    return response.data
  })
  .catch(error => {
    console.log(error.message)
  })
  const updateBalance = apiResponse.update_balance
  return updateBalance
}

export default setUpdateBalance