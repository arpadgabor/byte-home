const { Model } = require('objection')
const Devices = require('./devices')

module.exports = class Users extends Model {
  static tableName = 'users'

  static relationMappings = () => ({
    devices: {
      relation: Model.HasManyRelation,
      modelClass: Devices,
      join: {
        from: 'users.id',
        to: 'devices.owner'
      }
    }
  })
}
