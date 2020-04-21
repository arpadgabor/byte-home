const models = require('../models')

const find = async(model, query) => {
  const q = models[model].query()

  for (let term in query) {

    switch(term) {

      case 'start':
        q.offset(query.start)
        break

      case 'limit':
        q.limit(query.limit)
        break

      case 'sort':
        const sortQueries = term.sort.split(';')

        for (let sort of sortQueries) {
          const toSort = sort.split(':')
          q.orderBy(toSort[0], toSort[1])
        }
        break

      default:
        q.where(term, query[term])
        break;

    }

  }

  return await q.select()
}

module.exports = {
  find
}
