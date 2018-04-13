/**
 * UserController
 * Server-side logic for management Users
 */

"use strict";

const PATH = {dirname: require('path').resolve(sails.config.appPath, '.tmp/uploads/origin')};
const   popUser = {path: 'user', select: '_id nickname avatar'},
        popFromUserReport = {path: 'fromUser', select: '_id nickname avatar'},
        popToUserReport = {path: 'toUser', select: '_id nickname avatar isBlocked'},
        popReview = {path: 'review'};

module.exports = {

    /**
     * Detail a user
     * @Query params: null
     * @Route params:
     *    {ObjectId} id: id of product
     * @Polices
     *    verifyToken.js,
     *    validator/user/userExist
     * @return {json}
     */
    getUser: asyncWrap(async (req, res) => {
        let id = req.params.id;
        let user = await UserRepository.getUser(id);
        res.ok({data: user});
    }),

    getUserProfile : asyncWrap(async (req, res) => {
        let id = req.params.userid;
        let user = await UserRepository.getProfile(id);
        if(user) {
            res.ok({data:user});
        } else {
            res.badRequest({message: req.__("user_not_exist"), error:6 })
        }

    }),

    getMyProfile: asyncWrap(async (req, res) => {
        let user = req.user;
        sails.log.info(user);
        res.ok();
    }),

    /**
     * Get all users
     * @Query params:
     *    {number} page: page number in pagination
     * @Polices
     *    verifyToken
     * @return {json}
     */
    getUsers: asyncWrap(async (req, res) => {
      let page = req.query.page || 1;
      let users = await UserRepository.getUsers(page);
      res.ok({ data: users });
    }),

    /**
     * Get all users to array
     * @Query params:
     * @Polices
     *    verifyToken
     * @return {json}
     */
    getUsersToArray : asyncWrap(async (req, res) => {
        let users = await User
            .find({
                deletedAt: {$exists: false}
            })
            .select('_id nickname');
        res.ok({data: users});
    }),

    /**
     * Get all users
     * @Query params:
     *    {number} page: page number in pagination
     *    {type} type: value to filter
     * @Polices
     *    verifyToken
     * @return {json}
     */
    getFilterUsers: asyncWrap(async (req, res) => {
        let page = req.query.page || 1;
        let type = req.query.type;
        let users = await UserRepository.filterUsersAdmin(type,page);
        res.ok({ data:users });
    }),

    /**
     * Search users
     * @Query params:
     *    {number} page: page number in pagination
     *    {string} type: type to search
     *    {string} value: value to search
     * @Polices
     *    verifyToken
     * @return {json}
     */
    searchUsers: asyncWrap(async (req, res) => {
        let value = req.query.value;
        let page = req.query.page || 1;
        let users = await UserRepository.searchUsersAdmin(value, page);
        res.ok({ data: users });
    }),

    /**
     * Block and unblock user
     * if user blocked is isBlocked field = true
     * if user unblock is isBlocked field = false
     * @Router params:
     *    {ObjectId} id: id of user
     * @Polices
     *    verifyToken,
     *    validator/user/userExist
     * @return {json}
     */
    putUserBlock: asyncWrap(async (req, res) => {
        let id = req.params.id;
        let user = await User.findById(id);
        sails.log.debug(user);
        let blockUser = await User.findByIdAndUpdate(id, {$set: {isBlocked: !user.isBlocked}}, {new: true});
        let userReport = await Report.findOne({toUser: id});
        sails.log.debug(userReport);
        if (userReport) {
            // userReport.isHandle = !userReport.isHandle;
            await Report.findByIdAndUpdate(userReport._id, {$set: {isHandle: !userReport.isHandle}}, {new: true});
        }
        res.ok({data: blockUser});
    }),

    /**
     * Soft delete user by update deleteAt field = now a day
     * @Router params:
     *    {ObjectId} id: id of user
     * @Polices
     *    verifyToken,
     *    validator/user/userExist
     * @return {json}
     */
    deleteUser: asyncWrap(async (req, res) => {
        let id = req.params.id;
        let user = await User.findByIdAndUpdate(id, {$set: {deletedAt: new Date()}}, {new: true});
        res.ok({data: user});
    }),

    /**
     * Update a user
     * @Router params:
     *    {ObjectId} id : id of product
     * @Request params:
     *    {String}   email         : name of user
     *    {String}   password      : password of user
     *    {String}   nickname      : nickname of user
     *    {File}     avatar        : avatar of user, contain origin and thumnail image
     *    {Number}   gender        : gender of user | 1: male, 0: female
     * @Polices
     *    verifyToken.js,
     *    validator/user/userExist
     * @return {json}
     */
    postUpdateUser: asyncWrap(async (req, res) => {
        let id = req.params.id,
            user = req.body,
            options = {
                req: req,
                inputName: 'file',
                config: PATH
            };
        let upload = await UploadService.upload(options);
        user.avatar = upload;
        let person = await User.findByIdAndUpdate(id, {$set: user}, {new: true});
        res.ok({data: person});
    }),

    /**
     * Transfer coin for user
     * @Router params: null
     * @Request params:
     *    {ObjectId}   id      : name of user
     *    {Number}   coin      : password of user
     * @Polices
     *    verifyToken.js,
     *    validator/user/userCoin
     * @return {json}
     */
    postTransferCoinUser : asyncWrap(async (req, res) => {
        let id = req.param('id'),
            coin = req.param('coin');
        let userCoin = await UserCoin.findOne({user : id});
        userCoin.coin += parseInt(coin);
        await userCoin.save();
        res.ok({data : userCoin});
    }),

    /**
     * Transfer point for user
     * @Router params: null
     * @Request params:
     *    {ObjectId}   id      : name of user
     *    {Number}   point      : password of user
     * @Polices
     *    verifyToken.js,
     *    validator/user/userPoint
     * @return {json}
     */
    postTransferPointUser : asyncWrap(async (req, res) => {
        let id = req.param('id'),
            point = req.param('point');
        let userPoint = await UserPoint.findOne({user : id});
        userPoint.point += parseInt(point);
        await userPoint.save();
        res.ok({data : userPoint});
    }),

    // get user comments
    getUserComments : asyncWrap(async (req, res) => {
        let query = {},
            page = req.query.page || 1;

        let userComments = await UserComment.paginate(
            query,
            sails.helpers.optionPaginateAdmin(req, [popUser, popReview], page)
        );
        res.ok({data: userComments});
    }),

    // block user comment
    putUserCommentBlock : asyncWrap(async (req, res) => {
        let id = req.params.id;
        let comment = await UserComment.findByIdAndUpdate(id, {$set: {status: 0}}, {new: true});
        res.ok({data: comment});
    }),

    // approved user comment
    putUserCommentApproved : asyncWrap( async (req, res) => {
        let id = req.params.id;
        let comment = await UserComment.findByIdAndUpdate(id, {$set: {status: 1}}, {new: true});
        res.ok({data: comment});
    }),

    getUserReports : asyncWrap( async (req, res) => {
        let page = req.query.page || 1;
        let reports = await Report.paginate({}, sails.helpers.optionPaginateAdmin(req, [popFromUserReport, popToUserReport], page));
        res.ok({data: reports});
    }),

    getProductFavoriteByUser: asyncWrap(async (req, res) => {
        let user = req.params.userid;
        let page = req.query.page || 1;
        let selectFields = '-__v';
        let populate = [{
            path: 'user',
            select: 'nickname'
        }];

        let option = sails.helpers.optionPaginate(page, selectFields, populate);
        let productFavorites = await UserFavoriteProduct.paginate({
            user: user
        }, option);
        return res.ok({data:productFavorites});
    })
};
