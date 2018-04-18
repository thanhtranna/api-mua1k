/**
 * upload image
 */

'use strict';

module.exports = {
  uploadImg: asyncWrap(async (req, res) => {
    let settings = {
      dirname: require('path').resolve(
        sails.config.appPath,
        '.tmp/uploads/origin'
      )
    };

    let upload = await UploadService.upload({
      req: req,
      inputName: 'file',
      config: settings
    });

    if (!upload) {
      return res.badRequest({ message: req.__('upload_fail') });
    }

    let respone = {
      origin: upload[0].fd,
      thumb: upload[0].fd
    };
    return res.ok({ data: respone });
  })
};
