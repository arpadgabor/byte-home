const { Model } = require('objection')


module.exports = class People extends Model {
  static tableName = 'people'
  
  static get relationMappings() {
    const Users = require('./users')
    
    return {
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: Users,
        join: {
          from: 'people.user',
          to: 'users.id'
        }
      }
    }
  }
}
