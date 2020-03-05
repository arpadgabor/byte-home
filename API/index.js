const main = require('./src')

try {
  main()
} catch (e) {
  console.error('Could not start server. Does the database work?')
  console.error(e)
  process.exit(1)
}
