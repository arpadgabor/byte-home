const chalk = require('chalk')

function info(tag, message) {
  console.info(`${chalk.bold.white.bgGray(tag + ':')} ${chalk.gray(message)}`)
}

function error(tag, message) {
  console.error(`${chalk.bold.white.bgRedBright(tag + ':')} ${chalk.red(message)}`)
}

function warn(tag, message) {
  console.warn(`${chalk.bold.black.bgYellowBright(tag + ':')} ${chalk.yellow(message)}`)
}

function green(tag, message) {
  console.warn(`${chalk.bold.black.bgGreenBright(tag + ':')} ${chalk.greenBright(message)}`)
}

module.exports = {
  info, error, warn, green
}
