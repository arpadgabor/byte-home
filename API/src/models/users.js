const { Model } = require('objection')

module.exports = class Users extends Model {
  static tableName = 'users'

  static get relationMappings() {
    const Households = require('./households')
    const Roles = require('./roles')
    const People = require('./people')
    
    return {
        person: {
          relation: Model.HasOneRelation,
          modelClass: People,
          join: {
            from: 'users.id',
            to: 'people.user'
          }
        },
        households: {
          relation: Model.ManyToManyRelation,
          modelClass: Households,
          join: {
            from: 'users.id',
            through: {
              from: 'user_households.user',
              to: 'user_households.household'
            },
            to: 'households.id'
          }
        },
        role: {
          relation: Model.ManyToManyRelation,
          modelClass: Roles,
          join: {
            from: 'users.id',
            through: {
              from: 'user_roles.user',
              to: 'user_roles.role'
            },
            to: 'roles.id'
          }
        }
      }
    }
  }
