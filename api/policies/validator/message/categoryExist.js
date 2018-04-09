module.exports = asyncWrap(async (req, res, next) => {
  try {
    const id = req.param('category');
    const isId = sails.helpers.isMongoId(id);
    if (isId) {
      const cate = MessageCategory.count({ _id: id });
      if (cate) {
        return next();
      }
    }
    return res.badRequest({ message: 'Category not found' });
  } catch (error) {
    res.serverError({}, error);
  }
});
