import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import * as moment from 'moment'
import { AutiusClass } from '../../types'

function ClassCard({ title, price, start, end, teacherName, teacherLastName }: AutiusClass) {
  const _start = moment(new Date(Date.parse(start)))
  const _end = moment(new Date(Date.parse(end)))

  return (
    <article>
      <h4>
        { teacherName } { teacherLastName }
      </h4>
      <div>
        { _start.format('DD/MM/YYYY') } { _start.format('hh:mm') } - { _end.format('hh:mm') }
      </div>
      <div>
        { title }  <b>{ price }€</b>
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
