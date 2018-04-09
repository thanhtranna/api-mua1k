/**
 * Created by thanhtv on 4/10/18.
 */

module.exports = asyncWrap(async (req, res, next) => {
  req.checkBody('email', req.__('email_is_required')).notEmpty();
  req.checkBody('email', req.__('email_is_not_format')).isEmail();
  req.checkBody('content', req.__('content_is_required')).notEmpty();
  req
    .checkBody('contactCategory', req.__('contactCategory_is_required'))
    .notEmpty();
  let checkValidator = await req.getValidationResult();
  if (!checkValidator.isEmpty()) {
    return res.validationErrors(checkValidator.array());
  }

  let id = req.body.contactCategory;
  if (sails.helpers.isMongoId(id)) {
    let checkCategory = await ContactCategory.findOne({ _id: id });
    if (checkCategory) {
      return next();
    }
  }
  return res.badRequest(sails.errors.contactCategoryNotExist);
});
