import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import { AutiusClass } from '../../types'

function ClassCard({ title, price, start, end, teacherName }: AutiusClass) {
  const [ dateStart, timeStart ] = start.split(' ')
  const [ dateEnd, timeEnd ] = end.split(' ')
  const _timeStart = timeStart.split(':').slice(0, 2).join(':')
  const _timeEnd = timeEnd.split(':').slice(0, 2).join(':')

  return (
    <article>
      <h4>
        { teacherName }
      </h4>
      <div>
        { dateStart }{ ' ' }{ _timeStart }{ ' - ' }{ dateStart !== dateEnd && `${ dateEnd } ` }{ _timeEnd }
      </div>
      <div>
        { title }  <b>{ price }</b>
      </div>
    </article>
  )
}

function AvailableClassesMessage({ classes }) {
  return (
    <main>
      <h3>
        Nuevas clases disponibles
      </h3>
      <div>
        { classes.map((value: AutiusClass, index: number) => <ClassCard key={ index } { ...value } />) }
      </div>
    </main>
  )
}

export function buildAvailableClassesMessage(classes: Array<unknown>) {
  return ReactDOMServer.renderToString(<AvailableClassesMessage classes={ classes }/>)
}
