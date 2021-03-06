import { config } from 'dotenv'
import { of } from 'rxjs'
import { tap, mergeMap } from 'rxjs/operators'
import { cron } from './rxjs-cron'
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

  const classes: Array<AutiusClass> = (await getClasses()).results
  const cached: Array<Partial<AutiusClass>> = await getCachedClasses()

  let result = differenceBy(classes, cached, 'id')

  console.log('actual', classes.length)
  console.log('cached', cached.length)
  console.log('result', result.length)

  if (process.env.PREFERRED_TEACHER) {
    result = result.filter(({ teacherName }) => teacherName.toLowerCase().trim() === process.env.PREFERRED_TEACHER)
    console.log('preferred', result.length)
  }

  if (process.env.NODE_ENV === 'production' && result.length > 0) {
    await sendMail(buildAvailableClassesMessage(result))
  }

  await setCachedClasses(classes)

  console.log('done', new Date().toISOString())
}

export function schedule() {
  const obs$ = process.env.NODE_ENV === 'production' && process.env.APP_MODE !== 'single'
    ? cron(process.env.CRON_SCHEDULE)
    : of(1)

  obs$
    .pipe(
      tap(() => console.log('task scheduled')),
      mergeMap(() => main())
    )
    .subscribe()
}
