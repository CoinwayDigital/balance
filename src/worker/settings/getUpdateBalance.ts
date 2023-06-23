import { AxiosInstance } from 'axios'

const getUpdateBalance = async (api: AxiosInstance): Promise<boolean> => {
  const apiResponse = await api.get('settings/select')
  .then(response => {
    return response.data
  })
  .catch(error => {
    console.log(error.message)
  })

  // console.log(apiResponse)

  if(!apiResponse){
    return false
  }

  const updateBalance = apiResponse.updateBalance


  

  return updateBalance
}

export default getUpdateBalance