const { Model } = require('objection')

module.exports = class Households extends Model {
  static tableName = 'households'

  static get relationMappings() {
    const Users = require('../users/model')
    const Devices = require('../devices/model')
    return {
      devices: {
        relation: Model.HasManyRelation,
        modelClass: Devices,
        join: {
          from: 'households.id',
          to: 'devices.household'
        }
      },
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: Users,
        join: {
          from: 'households.id',
          through: {
            from: 'user_households.household',
            to: 'user_households.user'
          },
          to: 'users.id'
        }
      }
    }
  }
}
