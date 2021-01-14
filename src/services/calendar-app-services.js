export const eventFetchApi = async (eventId) => {
  try {
    const apiResponse = await fetch(
      `${process.env.REACT_APP_API}/events/${eventId}/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    if (apiResponse.ok) {
      const data = await apiResponse.json()
      return data
    }
  } catch (e) {
    console.log(e)
    return false
  }
}
