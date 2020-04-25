const config = require('./config')

module.exports = {
  client: 'pg',
  connection: config.get('dbUrl'),
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: './src/db/migrations'
  },
  seeds: {
    directory: './src/db/seeds'
  }
}
