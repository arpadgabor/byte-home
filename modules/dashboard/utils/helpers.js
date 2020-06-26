export const setAuthHeader = (token) => ({
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

export const listSensors = (user) => {
  let sensors = []

  for(let household of user.households) {
    for(let device of household.devices) {
      for(let sensor of device.sensors) {
        sensors.push(sensor)
      }
    }
  }

  return sensors
}
