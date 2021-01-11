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
      const apiResponse = await fetch('http://127.0.0.1:8000/events/')
      if (apiResponse.ok) {
        const data = await apiResponse.json()
        const newEvents = data.map(eventMap)
        console.log(newEvents)
        dispatch({ type: 'POPULATE_EVENTS', events: newEvents })
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    eventListApi()
    console.log('use effect ran')
  }, [])

  console.log('rerendered')
  console.log(events)

  return (
    <main className={styles.grid}>
      <div className={styles.gridItem}>
        <Link to='/event/create'>Create</Link>
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
