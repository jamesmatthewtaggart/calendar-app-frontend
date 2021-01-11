import React, { useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import styles from './event.module.css'
import EventsContext from '../context/events-context'
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
      setEvent()
    }
  }, [])

  const calendarRedirect = () => {
    history.push('/')
  }

  const createEventApi = async () => {
    const data = {
      title,
      start: moment(start).utc(),
      end: moment(end).utc()
    }
    console.log('Data to send.')
    console.log(data)
    try {
      const apiResponse = await fetch(
        'http://127.0.0.1:8000/events/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        }
      )
      if (apiResponse.ok) {
        const data = await apiResponse.json()
        dispatch({ type: 'ADD_EVENT', id: data.id, title: data.title, start: moment(start).toDate(), end: moment(end).toDate() })
      }
    } catch (e) {
      console.log(e)
    }
  }

  const updateEventApi = async () => {
    const data = {
      id: eventId,
      title,
      start,
      end
    }
    console.log('Data to send.')
    console.log(data)
    try {
      const apiResponse = await fetch(
        `http://127.0.0.1:8000/events/${eventId}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        }
      )
      if (apiResponse.ok) {
        const data = await apiResponse.json()
        dispatch({ type: 'EDIT_EVENT', id: data.id, title: data.title, start: moment(data.start).toDate(), end: moment(data.end).toDate() })
      }
    } catch (e) {
      console.log(e)
    }
  }

  const deleteEventApi = async () => {
    console.log('Delete id.')
    console.log(eventId)
    try {
      const apiResponse = await fetch(
        `http://127.0.0.1:8000/events/${eventId}/`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if (apiResponse.ok) {
        const data = await apiResponse.json()
        dispatch({ type: 'REMOVE_EVENT', id: data.id })
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
      reset()
      calendarRedirect()
    }
  }

  const updateEvent = () => {
    const valid = dateChecks()
    if (valid) {
      updateEventApi()
      reset()
      calendarRedirect()
    }
  }

  const setEvent = () => {
    console.log(events)
    console.log(eventId)
    const found = events.find((event) => {
      return `${eventId}` === `${event.id}`
    })
    if (found) {
      setTitle(found.title)
      setStart(found.start)
      setEnd(found.end)
    }
  }

  const deleteEvent = () => {
    deleteEventApi()
    reset()
    calendarRedirect()
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
      console.log('date check')
      const newEventRange = moment.range(start, end)
      const overlap = events.find((event, index) => {
        console.log(newEventRange)
        const eventRange = moment.range(event.start, event.end)
        console.log(eventRange)
        return newEventRange.overlaps(eventRange)
      })
      console.log(overlap)
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
