const { Model } = require('objection')

module.exports = class Users extends Model {
  static tableName = 'users'

  static get relationMappings() {
    const Households = require('../households/household.models')
    const { Roles, TokenWhitelist } = require('../auth/auth.models')
    const People = require('../people/people.models')

    return {
      person: {
        relation: Model.HasOneRelation,
        modelClass: People,
        join: {
          from: 'users.id',
          to: 'people.user',
        },
      },
      households: {
        relation: Model.ManyToManyRelation,
        modelClass: Households,
        join: {
          from: 'users.id',
          through: {
            from: 'user_households.user',
            to: 'user_households.household',
          },
          to: 'households.id',
        },
      },
      roles: {
        relation: Model.ManyToManyRelation,
        modelClass: Roles,
        join: {
          from: 'users.id',
          through: {
            from: 'user_roles.user',
            to: 'user_roles.role',
          },
          to: 'roles.id',
        },
      },
      tokens: {
        relation: Model.HasManyRelation,
        modelClass: TokenWhitelist,
        join: {
          from: 'token_whitelist.user',
          to: 'users.id',
        },
      },
    }
  }
}
