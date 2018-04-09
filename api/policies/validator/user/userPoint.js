
module.exports = async function (req, res, next) {
    try {
        req.checkBody('id', req.__('id_is_required')).notEmpty();
        req.checkBody('point', req.__('point_is_required')).notEmpty();

        let validationResult = await req.getValidationResult();
        if (validationResult.isEmpty()) {
            let id = req.param('id');
            let isCheck = sails.helpers.isMongoId(id);
            if (isCheck) {
                let user = await User.count({_id : id});
                if (user) {
                    return next();
                }
            }
            return res.badRequest({message: 'User not found'});
        }

        return res.validationErrors(validationResult.array());
    } catch (error) {
        res.serverError({}, error);
    }
};
