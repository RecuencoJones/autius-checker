const { Observable } = require('rxjs')
const { schedule } = require('node-cron')

export function cron(expr) {
  let counter = 0

  return new Observable((subscriber) => {
    const task = schedule(expr, () => {
      subscriber.next(counter++)
    })

    task.start()

    return () => task.destroy()
  })
}
