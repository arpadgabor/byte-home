const Sensor = require('./sensor.models')
const Readings = require('../readings/reading.models')
const { raw, fn } = require('objection')

const timeseries = async (sensorId, { from, to, step }) => {
  let fromDate = new Date(from).toISOString()
  let toDate = new Date(to).toISOString()

  const data = await Readings.query()
    .select(
      raw(`date_trunc('${step}', time)`).as('datetime'),
      raw('avg(value)')
    )
    .where('sensor', sensorId)
    .whereBetween('time', [toDate, fromDate])
    .groupBy('datetime')
    .orderBy('datetime')

  return data
}

module.exports = {
  timeseries,
}
