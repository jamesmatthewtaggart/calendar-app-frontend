const eventsReducer = (state, action) => {
  let index = null
  switch (action.type) {
    case 'POPULATE_EVENTS':
      return action.events
    case 'ADD_EVENT':
      return [
        ...state,
        { id: action.id, title: action.title, start: action.start, end: action.end }
      ]
    case 'EDIT_EVENT':
      index = state.indexOf((event) => event.id === action.id)
      if (index !== -1) {
        state[index] = {
          id: action.id, title: action.title, start: action.start, end: action.end
        }
      }
      return state
    case 'REMOVE_EVENT':
      return state.filter((event) => action.id !== event.id)
    default:
      return state
  }
}

export default eventsReducer
