module.exports = asyncWrap(async (req, res, next) => {
    let password = req.body.password;
    let confirm_password = req.body.confirm_password;

    if(password === confirm_password) {
        return next();
    }
    return res.badRequest({
        data: sails.errors.confirmPasswordFail,
        message: sails.errors.confirmPasswordFail.message,
        status: 422
    });
});
