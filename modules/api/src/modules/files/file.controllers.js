const Code = require('../../utils/statusCodes')
const FileService = require('./file.services')

module.exports = {
  async upload(ctx) {
    const files = await FileService.saveFiles(ctx.files)
    ctx.send(Code.OK, files)
  },

  delete(ctx) {

  }
}
