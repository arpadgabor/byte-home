const { Model } = require('objection')

module.exports = class People extends Model {
  static tableName = 'people'

  static get relationMappings() {
    const Users = require('../users/user.models')
    const Files = require('../files/file.model')

    return {
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: Users,
        join: {
          from: 'people.user',
          to: 'users.id',
        },
      },
      image: {
        relation: Model.HasOneRelation,
        modelClass: Files,
        join: {
          from: 'files.id',
          to: 'people.imageId'
        }
      }
    }
  }
}
