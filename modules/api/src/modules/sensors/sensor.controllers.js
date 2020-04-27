const SensorService = require('./sensor.services')
const Code = require('../../utils/statusCodes')

const getTimeseries = async (ctx) => {
  const { from, to, step } = ctx.request.query

  if (!(from && to && step)) {
    ctx.send(Code.BAD_REQUEST, 'Querystring does not contain all items needed')
  }

  const timeseries = await SensorService.timeseries(ctx.params.id, {
    from: from,
    to: to,
    step: step,
  })

  ctx.send(Code.OK, timeseries)
}

module.exports = {
  getTimeseries,
}
