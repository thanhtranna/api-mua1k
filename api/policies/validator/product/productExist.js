module.exports = asyncWrap(async (req, res, next) => {
  let id = '';
  if (req.body !== undefined) {
    id = req.body.product || req.params.id;
  } else {
    id = req.params.id || req.params.productid;
  }

  if (!sails.helpers.isMongoId(id))
    return res.badRequest(sails.errors.idMalformed);

  const checkProductExist = await Product.count({ _id: id });
  if (!checkProductExist) {
    return res.notFound(sails.errors.productNotFound);
  }

  next();
});
