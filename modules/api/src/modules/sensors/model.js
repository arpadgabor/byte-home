const { Model } = require('objection')

module.exports = class Sensors extends Model {
  static tableName = 'sensors'

  static get relationMappings() {
    const Readings = require('../readings/model')
    const Device = require('../devices/model')
    
    return {

      ofdevice: {
        relation: Model.BelongsToOneRelation,
        modelClass: Device,
        join: {
          from: 'sensors.device',
          to: 'devices.id'
        }
      },
      readings: {
        relation: Model.HasManyRelation,
        modelClass: Readings,
        join: {
          from: 'sensors.id',
          to: 'readings.sensor'
        }
      }
    }
  }
}
