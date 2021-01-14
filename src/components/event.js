import React, { useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import styles from './event.module.css'
import EventsContext from '../context/events-context'
import { eventFetchApi } from '../services/calendar-app-services'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Moment from 'moment'
import { extendMoment } from 'moment-range'

const moment = extendMoment(Moment)

const Event = (props) => {
  const { events, dispatch } = useContext(EventsContext)
  const history = useHistory()
  const eventId = props.match.params.id
  const isUpdate = !!eventId

  const [title, setTitle] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  useEffect(() => {
    if (isUpdate) {
      findEvent()
    }
  }, [])

  const findEvent = async () => {
    const found = events.find((event) => {
      return `${eventId}` === `${event.id}`
    })
    if (found) {
      setEvent(found.title, found.start, found.end)
    } else {
      eventFetchApi(eventId).then(
        (data) => {
          if (data) {
            setEvent(data.title, moment(data.start).toDate(), moment(data.end).toDate())
            dispatch({ type: 'EDIT_EVENT', id: data.id, title: data.title, start: moment(data.start).toDate(), end: moment(data.end).toDate() })
          }
        }
      )
    }
  }

  const setEvent = (title, start, end) => {
    setTitle(title)
    setStart(start)
    setEnd(end)
  }

  const calendarRedirect = () => {
    history.push('/')
  }

  const createEventApi = async () => {
    const data = {
      title,
      start: moment(start).utc(),
      end: moment(end).utc()
    }
    try {
      const apiResponse = await fetch(
        `${process.env.REACT_APP_API}/events/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      )
      if (apiResponse.ok) {
        const data = await apiResponse.json()
        dispatch({ type: 'ADD_EVENT', id: data.id, title: data.title, start: moment(start).toDate(), end: moment(end).toDate() })
        reset()
        calendarRedirect()
      }
    } catch (e) {
      console.log(e)
    }
  }

  const updateEventApi = async () => {
    const updateEventData = {
      id: eventId,
      title,
      start,
      end
    }
    try {
      const apiResponse = await fetch(
        `${process.env.REACT_APP_API}/events/${eventId}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateEventData)
        }
      )
      if (apiResponse.ok) {
        const data = await apiResponse.json()
        dispatch({ type: 'EDIT_EVENT', id: data.id, title: updateEventData.title, start: moment(updateEventData.start).toDate(), end: moment(updateEventData.end).toDate() })
        reset()
        calendarRedirect()
      }
    } catch (e) {
      console.log(e)
    }
  }

  const deleteEventApi = async () => {
    try {
      const apiResponse = await fetch(
        `${process.env.REACT_APP_API}/events/${eventId}/`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      if (apiResponse.ok) {
        dispatch({ type: 'REMOVE_EVENT', id: `${eventId}` })
        reset()
        calendarRedirect()
      }
    } catch (e) {
      console.log(e)
    }
  }

  const formSubmit = (e) => {
    e.preventDefault()
    if (isUpdate) {
      updateEvent()
    } else {
      createEvent()
    }
  }

  const createEvent = () => {
    const valid = dateChecks()
    if (valid) {
      createEventApi()
    }
  }

  const updateEvent = () => {
    const valid = dateChecks()
    if (valid) {
      updateEventApi()
    }
  }

  const deleteEvent = () => {
    deleteEventApi()
  }

  const dateChecks = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // check if date
    if (typeof start !== 'object' || typeof end !== 'object') {
      alert('Not date type.')
      return false
    } else if (start > end) {
      alert('Start date later than end date.')
      return false
    } else if (start < today) {
      alert('Start before today')
      return false
    } else {
      const newEventRange = moment.range(start, end)
      const overlap = events.find((event, index) => {
        if (eventId !== event.id.toString()) {
          const eventRange = moment.range(event.start, event.end)
          return newEventRange.overlaps(eventRange)
        } else {
          return false
        }
      })
      if (overlap) {
        alert('New event overlaps a existing.')
        return false
      }
    }
    return true
  }

  const reset = () => {
    setTitle('')
    setStart('')
    setEnd('')
  }

  const onClickDelete = () => {
    deleteEvent()
  }

  return (
    <form onSubmit={formSubmit}>
      <main className={styles.grid}>
        <div className={styles.gridItem}>
          <Link to='/'>Back</Link>
        </div>
        <div className={styles.gridItem}>
          <input className={styles.inlineItem} value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Add title' />
          <div className={styles.inline}>
            <div className={styles.inlineItem}>
              <DatePicker required placeholderText='Add start date' selected={start} showTimeSelect dateFormat='Pp' onChange={(date) => setStart(date)} />
            </div>
            <span className={styles.inlineItem}>to</span>
            <div className={styles.inlineItem}>
              <DatePicker required placeholderText='Add end date' selected={end} showTimeSelect dateFormat='Pp' onChange={(date) => setEnd(date)} />
            </div>
          </div>
        </div>
        <div className={styles.gridItem}>
          <div>
            <button className={styles.inlineItem}>Save</button>
            {isUpdate && <button className={styles.inlineItem} type='button' onClick={onClickDelete}>Delete</button>}
          </div>
        </div>
      </main>
    </form>
  )
}

export default Event
