import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

const mailer = async (to: string, subject: string, body: string): Promise <SMTPTransport.SentMessageInfo | void> => {
  const userMail = process.env.USERMAIL
  const passMail = process.env.PASSMAIL
  const smtpServer = 'smtp.gmail.com'
  const smtpPort = 465

  const transporter = nodemailer.createTransport({
    host: smtpServer,
    port: smtpPort,
    secure: true,
    auth: {
      user: userMail,
      pass: passMail,
    },
  })

  const transporterResponse = await transporter.sendMail({
    from: userMail,
    to:to,
    subject: subject,
    text: body
  })
  .then(response => {
    console.log(response)
  })
  .catch(error => {
    console.log(error)
  })

  return transporterResponse
}

export default mailer