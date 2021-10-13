import express from 'express'
import db from '@src/infra'

const app = express()
app.get('/', (request, response) => {
  return response.json({
    message: 'Hello World!',
    database: db()
  })
})

app.listen(8080)
