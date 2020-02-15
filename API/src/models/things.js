const { Model } = require('objection')
const Devices = require('./devices')

module.exports = class Things extends Model {
  static tableName = 'things'

  static relationMappings = () => ({
    device: {
      relation: Model.BelongsToOneRelation,
      modelClass: Devices,
      join: {
        from: 'things.device',
        to: 'devices.id'
      }
    }
  })
}
