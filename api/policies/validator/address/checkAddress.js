/**
 * Created by thanhtv on 4/10/18.
 */

module.exports = asyncWrap(async (req, res, next) => {
  const { id } = req.params;
  const isObject = sails.helpers.isMongoId(id);
  if (isObject) {
    const checkAddress = await UserAddress.count({ _id: id });

    if (checkAddress) {
      return next();
    }
  }
  return res.badRequest(sails.errors.addressNotExist);
});
