'use strict';

module.exports = asyncWrap(async (req, res, next) => {
  let categoryId = '';
  if (req.body !== undefined) {
    categoryId = req.body.category;
  } else {
    categoryId = req.query.category;
  }

  if (!categoryId) return next();

  if (!sails.helpers.isMongoId(categoryId))
    return res.badRequest(sails.errors.idMalformed);

  const isCategoryExist = await Category.count({ _id: categoryId });
  if (!isCategoryExist) return res.notFound(sails.errors.categoryNotFound);

  next();
});
