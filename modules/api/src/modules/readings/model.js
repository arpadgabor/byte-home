const { Model } = require('objection')

module.exports = class Readings extends Model {
  static tableName = 'readings'
  
  static get relationMappings() {
    const Sensors = require('../sensors/model')
    return {
      ofsensor: {
        relation: Model.BelongsToOneRelation,
        modelClass: Sensors,
        join: {
          from: 'readings.sensor',
          to: 'sensors.id'
        }
      }
    }
  }
}
