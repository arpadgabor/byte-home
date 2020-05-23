const { Model } = require('objection')

module.exports = class Files extends Model {
  static tableName = 'files'
}
