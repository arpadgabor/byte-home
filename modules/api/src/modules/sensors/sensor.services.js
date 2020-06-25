const Sensor = require('./sensor.models')
const Readings = require('../readings/reading.models')
const { raw } = require('objection')

const timeseries = async (sensorId, { from, to, step, avg = 'true', min, max, compareBy, compareAt }) => {

  // This is the base query
  const query = Readings
    .query()
    .where('sensor', sensorId)
    .whereBetween('time', [to, from])
    .groupBy('datetime')
    .orderBy('datetime')
    .select(raw(`date_trunc('${step}', time)`).as('datetime'))

  if (compareBy) { // Add these things to the query if compareBy exists
    query
      .select(raw(`date_part('${compareBy}', time)`).as('datepart'))
      .having(raw(`date_part('${compareBy}', time)`), '=', compareAt)
      .groupBy('datepart')
  }

  if (avg === 'true') query.avg('value') // these are also optional
  if (min === 'true') query.min('value')
  if (max === 'true') query.max('value')

  return await query // run the query and return the result
}

const timeseriesV2 = async (sensorId, { start, finish, step, avg = 'true', min, max }) => {

  // This is the base query
  const query = Readings
    .query()
    .select(raw(`
      time_bucket_gapfill(
        ?, time,
        start => ?,
        finish => ?
      )`, [step, start, finish]).as('datetime'))
    .where('sensor', sensorId)
    .whereBetween('time', [start, finish])
    .groupBy('datetime')
    .orderBy('datetime')

  if (avg === 'true') query.avg('value')
  if (min === 'true') query.min('value')
  if (max === 'true') query.max('value')

  return await query
}

const currentState = async (sensorId) => {
  return await Readings.query().where('sensor', sensorId).orderBy('time', 'DESC').limit(1).first()
}

module.exports = {
  timeseries,
  timeseriesV2,
  currentState
}
