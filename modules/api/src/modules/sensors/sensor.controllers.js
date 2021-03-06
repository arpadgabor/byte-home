const SensorService = require('./sensor.services')
const Code = require('../../utils/statusCodes')

const getTimeseries = async (ctx) => {
  const timeseries = await SensorService.timeseries(ctx.params.sensorId, ctx.request.query)

  ctx.send(Code.OK, timeseries)
}

const getTimeseriesV2 = async (ctx) => {
  const timeseries = await SensorService.timeseriesV2(ctx.params.sensorId, ctx.request.query)

  ctx.send(Code.OK, timeseries)
}

const getState = async (ctx) => {
  const state = await SensorService.currentState(ctx.params.sensorId)
  ctx.send(Code.OK, state)
}

const getSensor = async (ctx) => {
  const sensor = await SensorService.findById(ctx.params.sensorId)
  ctx.send(Code.OK, sensor)
}

const updateSensor = async (ctx) => {
  const updated = await SensorService.update(ctx.params.sensorId, ctx.request.body)
  ctx.send(Code.OK, updated)
}

module.exports = {
  getTimeseries,
  getTimeseriesV2,
  getState,
  getSensor,
  updateSensor
}
