const main = require('./src')

try {
  main()
} catch (err) {
  console.error('Could not start server. Does the database work?')
  process.exit(1)
}
