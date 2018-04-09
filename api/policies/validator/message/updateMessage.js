module.exports = async function(req, res, next) {
  try {
    if (req.param('category')) {
      const categoryId = req.param('category');
      const isIdMongo = sails.helpers.isMongoId(categoryId);
      if (isIdMongo) {
        const category = await MessageCategory.count({ _id: categoryId });
        if (category) {
          return next();
        }
      }
      return res.badRequest({ message: 'Category not found' });
    }
    return next();
  } catch (error) {
    res.serverError({}, error);
  }
};
