module.exports = asyncWrap(async (req, res, next) => {
    let id =req.params.id;
    let isObject = sails.helpers.isMongoId(id);
    if(isObject) {
        let checkUserExist = await User.count({_id: id});
        if(checkUserExist) {
            return next();
        }
    }
    return res.badRequest(sails.errors.userNotFound);
})
