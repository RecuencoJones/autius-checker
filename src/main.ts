import { config } from 'dotenv'
import * as cron from 'node-cron'
import differenceBy = require('lodash.differenceby')
import { sendMail } from './service/mail/sender'
import { buildAvailableClassesMessage } from './service/mail/message'
import { getClasses } from './service/puppeteer/actions'
import { getCachedClasses, setCachedClasses, initCache } from './service/cache'
import { AutiusClass } from './types'

config()
initCache()

export async function main() {
  console.log('running', new Date().toISOString())

  const classes: Array<AutiusClass> = await getClasses()
  const cached: Array<Partial<AutiusClass>> = await getCachedClasses()

  const result = differenceBy(classes, cached, 'id')

  console.log('actual', classes.length)
  console.log('cached', cached.length)
  console.log('result', result.length)

  if (process.env.NODE_ENV === 'production' && result.length > 0) {
    await sendMail(buildAvailableClassesMessage(result))
  }

  await setCachedClasses(classes.map(({ id }) => ({ id })))

  console.log('done', new Date().toISOString())
}

export function schedule() {
  if (process.env.NODE_ENV === 'production') {
    const task = cron.schedule(process.env.CRON_SCHEDULE, main)

    task.start()

    console.log('task scheduled')
  }
}
