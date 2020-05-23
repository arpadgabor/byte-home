const multer = require('multer')
const { rename } = require('fs').promises
const { HttpError } = require('../../utils/errors')
const Files = require('./file.model')

module.exports = {
  /**
   * @param {array} uploadedFiles
   */
  async saveFiles(uploadedFiles) {
    const files = []

    for (let file of uploadedFiles) {
      const extension = file.originalname.split('.').pop()
      const newFile = await rename(file.path, file.path + '.' + extension)
      log.info('FILE', newFile)

      files[files.length] = {
        name: file.originalname,
        hash: file.filename,
        extension: extension,
        size: file.size,
        mime: file.mimetype,
        url: 'uploads/' + file.path.split('/')[2] + '.' + extension,
      }
    }

    return await Files.query().insertGraph(files)
  }
}
