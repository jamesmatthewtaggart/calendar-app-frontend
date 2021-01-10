import React from 'react'
import { Link } from 'react-router-dom'
import styles from './event.module.css'

const Event = () => {
  return (
    <main className={styles.grid}>
      <div className={styles.gridItem}>
        <Link to='/'>Back</Link>
      </div>
      <div className={styles.gridItem}>
        <input className={styles.inlineItem} placeholder='Add title' />
        <div className={styles.inline}>
          <input className={styles.inlineItem} placeholder='Add start date' />
          <span className={styles.inlineItem}>to</span>
          <input className={styles.inlineItem} placeholder='Add end date' />
        </div>
      </div>
      <div className={styles.gridItem}>
        <div>
          <button className={styles.inlineItem}>Save</button>
          <button className={styles.inlineItem}>Delete</button>
        </div>
      </div>
    </main>
  )
}

export default Event
