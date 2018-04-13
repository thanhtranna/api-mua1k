/**
 * Created by daulq on 9/13/17.
 */

module.exports = asyncWrap(async (req, res, next) => {
    let id = req.params.id;
    let isObject = sails.helpers.isMongoId(id);
    if(isObject) {
        let checkAddress = await UserAddress.count({_id:id});

        if(checkAddress) {
            return next();
        }
    }
    return res.badRequest(sails.errors.addressNotExist);
});