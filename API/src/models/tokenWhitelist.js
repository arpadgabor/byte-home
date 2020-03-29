const { Model } = require('objection')

module.exports = class TokenWhitelist extends Model {
  static tableName = 'tokenWhitelist'
}
