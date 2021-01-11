import React, { useReducer } from 'react'
import CalendarAppRouter from '../routers/calendar-app-router'
import './calendar-app.css'
import EventsContext from '../context/events-context'
import eventsReducer from '../reducers/events-reducer'

const CalendarApp = () => {
  const [events, dispatch] = useReducer(eventsReducer, [])

  return (
    <EventsContext.Provider value={{ events, dispatch }}>
      <CalendarAppRouter />
    </EventsContext.Provider>
  )
}

export default CalendarApp
