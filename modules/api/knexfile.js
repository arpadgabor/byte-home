require('dotenv').config()

module.exports = {
  client: 'pg',
  connection: process.env.CONNECTION_URL,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: './src/migrations'
  },
  seeds: {
    directory: './src/seeds'
  }
}
