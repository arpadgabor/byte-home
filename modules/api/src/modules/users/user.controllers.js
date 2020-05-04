const UserService = require('./user.services')
const Code = require('../../utils/statusCodes')

const getMe = async (ctx) => {
  const me = await UserService.findById(
    ctx.state.userId,
    '[person, households.devices.sensors]'
  )

  delete me.password
  delete me.verificationToken
  delete me.resetToken
  delete me.created_at
  delete me.updated_at

  ctx.send(Code.OK, me)
}

module.exports = {
  getMe,
}
