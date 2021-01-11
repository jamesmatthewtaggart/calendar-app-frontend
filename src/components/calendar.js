import React, { useEffect, useContext } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import styles from './calendar.module.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Link, useHistory } from 'react-router-dom'
import EventsContext from '../context/events-context'

const localizer = momentLocalizer(moment)

const CalendarAppCalendar = () => {
  const { events, dispatch } = useContext(EventsContext)
  const history = useHistory()

  const eventRedirect = (id) => {
    history.push(`/event/update/${id}`)
  }

  const eventMap = (event) => {
    return {
      ...event,
      start: moment(event.start).toDate(),
      end: moment(event.end).toDate()
    }
  }

  const eventListApi = async () => {
    try {
      const apiResponse = await fetch('https://james-calendar-app-backend.herokuapp.com/events/')
      if (apiResponse.ok) {
        const data = await apiResponse.json()
        const newEvents = data.map(eventMap)
        dispatch({ type: 'POPULATE_EVENTS', events: newEvents })
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    eventListApi()
    console.log('effect ran')
  }, ['events'])

  return (
    <main className={styles.grid}>
      <div className={styles.gridItem}>
        <Link to='/event/create'>Create Event</Link>
      </div>
      <div className={styles.gridItem}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor='start'
          endAccessor='end'
          style={{ height: 500 }}
          onSelectEvent={(event) => (eventRedirect(event.id))}
        />
      </div>
    </main>
  )
}

export default CalendarAppCalendar
