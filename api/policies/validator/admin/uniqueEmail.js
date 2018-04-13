module.exports = asyncWrap(async (req, res, next) => {
    let email = req.body.email;
    let user = await Admin.findOne({email: email});
    if (!user)
        return next();
    return res.badRequest({
        data: sails.errors.emailAdminExists,
        message: sails.errors.emailAdminExists.message,
        status: 422
    });
});
