const { Model } = require('objection')

module.exports = class Sensors extends Model {
  static tableName = 'sensors'
}
