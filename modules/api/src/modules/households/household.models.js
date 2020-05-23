const { Model } = require('objection')

module.exports = class Households extends Model {
  static tableName = 'households'

  static get relationMappings() {
    const Users = require('../users/user.models')
    const Devices = require('../devices/device.models')
    const Files = require('../files/file.model')

    return {
      devices: {
        relation: Model.HasManyRelation,
        modelClass: Devices,
        join: {
          from: 'households.id',
          to: 'devices.household',
        },
      },
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: Users,
        join: {
          from: 'households.id',
          through: {
            from: 'user_households.household',
            to: 'user_households.user',
          },
          to: 'users.id',
        },
      },
      image: {
        relation: Model.HasOneRelation,
        modelClass: Files,
        join: {
          from: 'files.id',
          to: 'households.imageId'
        }
      }
    }
  }
}
