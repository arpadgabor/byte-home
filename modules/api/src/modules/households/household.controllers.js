const HouseholdService = require('./household.services')
const Code = require('../../utils/statusCodes')

const getAll = async (ctx) => {
  const households = await HouseholdService.find(ctx.state.userId)
  ctx.send(Code.OK, { households: households })
}

const getById = async (ctx) => {
  const household = await HouseholdService.findById(
    ctx.params.id,
    'devices.sensors'
  )
  ctx.send(Code.OK, household)
}

const create = async (ctx) => {
  const household = await HouseholdService.create(ctx.request.body)
  await household.$relatedQuery('users').relate(ctx.state.userId)

  ctx.send(Code.OK, household)
}

const addDevice = async (ctx) => {
  const household = await HouseholdService.addDevice(
    ctx.request.body.mac,
    ctx.params.id
  )

  ctx.send(Code.OK, household)
}

const getInvite = async (ctx) => {
  const { inviteCode, inviteExpiry } = await HouseholdService.findById(ctx.params.id)

  if (new Date(inviteExpiry) > new Date()) {
    return ctx.send(Code.OK, { inviteCode: inviteCode, inviteExpiry: inviteExpiry })
  }

  const invite = HouseholdService.generateInviteCode()
  await HouseholdService.update(ctx.params.id, invite)

  return ctx.send(Code.OK, invite)
}

const acceptInvite = async ctx => {
  const household = await HouseholdService.verifyInvite(ctx.request.body.inviteCode, ctx.state.userId)
  return ctx.send(Code.OK, household)
}

module.exports = {
  getAll,
  getById,
  create,
  addDevice,
  getInvite,
  acceptInvite
}
