import dayjs from "dayjs"
import sleep from "../sleep"

const checkerExpire = async () => {

  const now = dayjs(new Date).unix()
  const expire = global.authenticateData.refreshToken.expiresIn
  // console.log(now, expire)

  // if (now < expire) {
  //   console.log('Na validade')
  // } else {
  //   console.log('Expirado')
  // }

}

export default checkerExpire