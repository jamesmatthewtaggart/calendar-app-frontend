import React from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import styles from './calendar.module.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Link } from 'react-router-dom'

const localizer = momentLocalizer(moment)

const CalendarAppCalendar = () => {
  return (
    <main className={styles.grid}>
      <div className={styles.gridItem}>
        <Link to='/event/create'>Create</Link>
      </div>
      <div className={styles.gridItem}>
        <Calendar
          localizer={localizer}
          events={[]}
          startAccessor='start'
          endAccessor='end'
          style={{ height: 500 }}
        />
      </div>
    </main>
  )
}

export default CalendarAppCalendar
