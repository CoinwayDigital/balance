import { client } from '@src/prisma/client'


const main = async () => {
  const test = await client.users.findFirst()
  console.log(test)
}

main()