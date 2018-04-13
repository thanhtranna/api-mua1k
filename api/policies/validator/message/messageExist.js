module.exports = asyncWrap(async (req, res, next) => {
    try {
        let id = req.params.id;
        let isMessage = sails.helpers.isMongoId(id);
        if (isMessage) {
            let message = Message.count({_id: id});
            if (message) {
                return next();
            }
        }
        return res.badRequest({message: 'Message not found'});
    } catch (error) {
        res.serverError({}, error);
    }
})
