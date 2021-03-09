import { createTransport } from 'nodemailer'
import * as sparkPost from 'nodemailer-sparkpost-transport'

export async function sendMail(html: string) {
  const transport = createTransport(sparkPost({
    sparkPostApiKey: process.env.SPARKPOST_API_KEY,
    endpoint: 'https://api.eu.sparkpost.com'
  }))

  await transport.sendMail({
    from: process.env.SPARKPOST_USER,
    to: process.env.MAIL_TO,
    subject: 'Clases disponibles en Autius',
    html
  })
}
