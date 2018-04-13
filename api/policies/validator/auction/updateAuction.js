/**
 * This file will validate update auction
 */
module.exports = async function (req, res, next) {
    try {
        // req.checkBody('product', req.__('product_is_required')).notEmpty();

        if (req.body.startAt) {
            req.checkBody('startAt', req.__('開始時日は書式と一致していません。')).isDate();
            // req.checkBody('startAt', req.__('startAt_must_after_current_date')).isAfter();
        }

        if (req.body.expiredAt) {
            req.checkBody('expiredAt', req.__('有効期限は書式と一致していません。')).isDate();
            req.checkBody('expiredAt', req.__('有効期限は正しい日付ではありません。')).isAfter(req.body.startAt);
        }

        if (req.body.finishAt) {
            req.checkBody('finishAt', req.__('終了時日は書式と一致していません。')).isDate();
            // req.checkBody('finishAt', req.__('finishAt_must_into_limit_startAt_expiredAt'))
            //     .isAfter(req.body.startAt)
            //     .isBefore(req.body.expiredAt);
        }

        if (req.body.status) {
            req.checkBody('status', req.__('状態は整数にしてください。')).isAlphanumeric();
        }

        let validationResult = await req.getValidationResult();
        if (validationResult.isEmpty()) return next();

        res.validationErrors(validationResult.array());
    } catch (error) {
        res.serverError({}, error);
    }
};
