const Sensor = require('./sensor.models')
const Readings = require('../readings/reading.models')
const { raw } = require('objection')

const timeseries = async (sensorId, { from, to, step, avg = 'true', min, max, compareBy, compareAt }) => {
  const query = Readings
    .query()
    .where('sensor', sensorId)
    .whereBetween('time', [to, from])
    .groupBy('datetime')
    .orderBy('datetime')
    .select(raw(`date_trunc('${step}', time)`).as('datetime'))

  if (compareBy) {
    query
      .select(raw(`date_part('${compareBy}', time)`).as('datepart'))
      .having(raw(`date_part('${compareBy}', time)`), '=', compareAt)
      .groupBy('datepart')
  }

  if (avg === 'true') query.avg('value')
  if (min === 'true') query.min('value')
  if (max === 'true') query.max('value')

  return await query
}

module.exports = {
  timeseries,
}
