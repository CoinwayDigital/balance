import { AxiosInstance } from "axios"
import dayjs from "dayjs"
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
dayjs.extend(timezone)

const timezoneLocale = "America/Chicago"

const getReportOtherBalance = async (api: AxiosInstance) => {
  console.log('[araucaria-balance] Update report tracking on Other Balance')

  const apiResponseSettings = await api.get('settings/select')
  .then(response => {
    return response.data
  })
  .catch(error => {
    console.log(error.message)
  })

  const minHourFilter = apiResponseSettings.minTimeTrackingReport ? apiResponseSettings.minTimeTrackingReport : 21
  const maxHourFilter = apiResponseSettings.maxTimeTrackingReport ? apiResponseSettings.maxTimeTrackingReport : 24

  const time = dayjs().tz(timezoneLocale, true)
  const hour = time.hour()

  if((hour < minHourFilter) || (hour > maxHourFilter)){
    await api.put('other-balance/report/update')
    .then(response => {
      console.log('[araucaria-balance] Report tracker response ...')
      console.log(response.data)
    })
    .catch(error => {
      console.log('[araucaria-balance] Error on Report Tracker ...')
      console.log(error)
    })
  } else {
    console.log('[araucaria-balance] Report tracker canceled for interval filter')
  }

  
}

export default getReportOtherBalance