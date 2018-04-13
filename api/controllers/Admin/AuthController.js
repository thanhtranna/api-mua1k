/**
 * AuthController
 *
 * @description :: Server-side logic for managing accounts admin
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * Login
     * Params
     *    {string} email
     *    {string} password
     * Polices
     *    validator/common/validateEmail
     *    validator/common/validatePassword
     * @return {string} json web token
     */
    postLogin: asyncWrap(async (req, res) => {
        let {email, password} = req.body;

        let user = await UserService.login(email, password, Admin);

        if (!user) return res.badRequest(sails.errors.wrongPasswordOrEmail);

        let token = UserService.generateUserToken(user);

        res.ok({data: token});
    }),

    getMyProfile: asyncWrap(async (req, res) => {
        let admin = await Admin.findOne({'_id': req.admin._id});
        if (!admin) return res.badRequest(sails.errors.userNotFound);
        res.ok({data: admin});
    }),

    getUserAdmins: asyncWrap(async (req, res) => {
        let page = req.query.page || 1;
        let admin = await Admin.paginate({}, sails.helpers.optionPaginateAdmin(req, [], page));
        res.ok({data: admin});
    }),

    postUserAdmin: asyncWrap(async (req, res) => {
        let admin = req.body;
        let createAdmin = await Admin.create(admin);
        res.ok({data: createAdmin});
    }),

    putUserAdmin: asyncWrap(async (req, res) => {
        let userid = req.params.id;
        let admin = req.body;
        admin.password = await BcryptService.hash(admin.password);
        let updateAdmin = await Admin.findByIdAndUpdate({_id: userid}, {$set: admin}, {$new: true});
        res.ok({data: updateAdmin});
    }),

};

