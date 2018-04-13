module.exports = asyncWrap(async (req, res, next) => {
    req.checkBody("email", req.__("メールアドレスは必須です。")).notEmpty();
    req.checkBody("email", req.__("メールアドレスを正しいメールアドレスにしてください。")).isEmail();
    req.checkBody("content", req.__("内容は必須です。")).notEmpty();
    req.checkBody("contactCategory", req.__("連絡先カテゴリは必須です。")).notEmpty();
    let checkValidator = await req.getValidationResult();
    if(!checkValidator.isEmpty()) {
        return res.validationErrors(checkValidator.array());
    }

    let id = req.body.contactCategory;
    if(sails.helpers.isMongoId(id)) {
        let checkCategory = await ContactCategory.findOne({_id:id});
        if(checkCategory) {
            return next();
        }
    }
    return res.badRequest(sails.errors.contactCategoryNotExist);
});
