const { Model } = require('objection')

class TokenWhitelist extends Model {
  static tableName = 'token_whitelist'
}

class Roles extends Model {
  static tableName = 'roles'
  
  static get relationMappings() {
    const Users = require('../users/model')
    return {
      user: {
        relation: Model.ManyToManyRelation,
        modelClass: Users,
        join: {
          from: 'roles.id',
          through: {
            from: 'user_roles.role',
            to: 'user_roles.user'
          },
          to: 'users.id'
        }
      }
    }
  }
}

module.exports = {
  TokenWhitelist, Roles
}
