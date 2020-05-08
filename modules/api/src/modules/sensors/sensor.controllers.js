const SensorService = require('./sensor.services')
const Code = require('../../utils/statusCodes')

const getTimeseries = async (ctx) => {
  const timeseries = await SensorService.timeseries(ctx.params.sensorId, ctx.request.query)

  ctx.send(Code.OK, timeseries)
}

module.exports = {
  getTimeseries,
}
