const { Model } = require('objection')


module.exports = class Roles extends Model {
  static tableName = 'roles'
  
  static get relationMappings() {
    const Users = require('./users')
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
