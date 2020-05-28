import { createTransport } from 'nodemailer'
import SMTPTransport = require('nodemailer/lib/smtp-transport')

export async function sendMail(html: string) {
  const transport = createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  } as SMTPTransport.Options)

  await transport.sendMail({
    from: process.env.GMAIL_USER,
    to: process.env.MAIL_TO,
    subject: 'Clases disponibles en Autius',
    html
  })
}
