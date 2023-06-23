import { AxiosInstance } from 'axios'

const getLockExchanges = async (api: AxiosInstance): Promise<boolean> => {
  const apiResponse = await api.get('settings/select')
  .then(response => {
    return response.data
  })
  .catch(error => {
    console.log(error.message)
  })

  if(!apiResponse){
    return undefined
  }

  const lockExchanges = apiResponse.lockExchanges


  

  return lockExchanges
}

export default getLockExchanges