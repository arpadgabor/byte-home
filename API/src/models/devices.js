const { Model } = require('objection')
const Users = require('./users')
const Things = require('./things')

module.exports = class Devices extends Model {
  static tableName = 'devices'

  static relationMappings = () => ({
    owner: {
      relation: Model.BelongsToOneRelation,
      modelClass: Users,
      join: {
        from: 'devices.owner',
        to: 'users.id'
      }
    },
    things: {
      relation: Model.HasManyRelation,
      modelClass: Things,
      join: {
        from: 'devices.id',
        to: 'things.device'
      }
    }
  })
}
