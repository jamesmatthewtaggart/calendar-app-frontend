import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Calendar from '../components/calendar'
import Event from '../components/event'
import NotFound from '../components/error-not-found'

const CalendarAppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' component={Calendar} exact />
        <Route path='/event/update/:id' component={Event} exact />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  )
}

export default CalendarAppRouter
