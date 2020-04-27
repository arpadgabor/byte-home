const { Model } = require('objection')

module.exports = class Devices extends Model {
  static tableName = 'devices'

  static get relationMappings() {
    const Households = require('../households/household.models')
    const Sensors = require('../sensors/sensor.models')

    return {
      households: {
        relation: Model.BelongsToOneRelation,
        modelClass: Households,
        join: {
          from: 'devices.household',
          to: 'households.id',
        },
      },
      sensors: {
        relation: Model.HasManyRelation,
        modelClass: Sensors,
        join: {
          from: 'devices.id',
          to: 'sensors.device',
        },
      },
    }
  }
}
