const eventsReducer = (state, action) => {
  switch (action.type) {
    case 'POPULATE_EVENTS':
      return action.events
    case 'ADD_EVENT':
      return [
        ...state,
        { id: action.id, title: action.title, start: action.start, end: action.end }
      ]
    case 'EDIT_EVENT':
      state[state.findIndex((event) => event.id === action.id)] = { id: action.id, title: action.title, start: action.start, end: action.end }
      return state
    case 'REMOVE_EVENT':
      return state.filter((event) => action.id !== event.id)
    default:
      return state
  }
}

export default eventsReducer
