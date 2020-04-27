const DeviceService = require('./device.services')

const update = async (ctx) => {
  const updated = await DeviceService.update(ctx.params.id, ctx.request.body)
}

module.exports = {
  update,
}
