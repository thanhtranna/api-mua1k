/**
 * UserController
 * Server-side logic for management Users
 */

"use strict";
const fieldUser = "id nickname email avatar";

module.exports = {

    /**
     * Function getUserProfile
     * @description Get profile other profile.
     * @Route: params:
     *   {ObjectId()} userid id of user
     */

    getUserProfile : asyncWrap(async (req, res) => {
        let id = req.params.userid;
        let user = await UserRepository.getProfile(id);
        if(user) {
            res.ok({data:user});
        } else {
            res.badRequest({message: req.__("user_not_exist"), error:6 })
        }

    }),

    /**
     * Function getMyProfile
     * @description Get my profile.
     */

    getMyProfile: asyncWrap(async (req, res) => {
        let user = req.user;
        user = await UserRepository.getProfile(user._id);
        user.coin = await await UserRepository.getCoin(user._id);
        user.point = await UserRepository.getPoint(user._id);
        user.isCheckin = await UserRepository.isCheckin(user._id);
        user.valueCheckin = await UserRepository.getNumberDateCheckin(user._id);

        if(user) {
            res.ok({data:user});
        } else {
            res.badRequest({message: req.__("user_not_exist"), error:6 })
        }
    }),
    /**
     * Function getHistoryChanceBuy
     * @description Get history user chance buy.
     * @Query params:
     *   {number} page: page number in pagination
     * @Route params:
     *   {objectId()} id: id of user
     * @Polices
     *   /validator/user/userExist
     * @Return {Array json}
     *
     */

    getHistoryChanceBuy: asyncWrap(async (req, res) => {
        let id = req.params.id;
        let page = req.query.page !== undefined ? req.query.page : 1;
        let userAuctionBuy = await AuctionRepository.auctionHistoryByUser(id, page);
        res.ok({data: userAuctionBuy});
    }),

    /**
     * Function auctionHistoryById
     * @description Get detail history chance buy.
     * @Route params:
     *   {objectId()} id: id of user
     *   {objectId()} auctionid: id of auction
     * @Polices
     *   /validator/user/userExist
     *   /validator/user/auctionExist
     * @Return {Array json}
     */

    auctionHistoryById: asyncWrap(async (req, res) => {
        let auction = req.params.auctionid;
        let user = req.params.id;
        let userChanceBuys = await AuctionRepository.auctionByUser(auction, user);
        res.ok({data:userChanceBuys});
    }),

    /**
     * Function winAuctionHistory
     * @description get history win auction of user.
     * @Route params:
     *   {ObjectId()} id: id of user
     * @Polices
     *   /validator/user/userExist
     */

    winAuctionHistory:  asyncWrap(async (req, res) => {
        let id = req.params.id;
        let page = req.query.page !== undefined ? req.query.page : 1;
        let auctionWinners = await AuctionRepository.winAuctionHistoryByUser(id, page);
        res.ok({data:auctionWinners});
    }),

    /**
     * Function reviewList
     * @description Get list review of user.
     * @Route params:
     *   {ObjectId()} id id of user
     * @Query params:
     *   {Number} page page of user
     * @Polices
     *   /validator/user/userExist
     */

    reviewList: asyncWrap(async (req, res) => {
        let userId = req.params.id;
        let page = req.query.page ? req.query.page : 1;
        let me = req.user ? req.user._id : null;
        let reviews = await ReviewRepository.reviewByUser(userId, me, page);
        return res.ok({data: reviews});
    }),

    /**
     * Function changeAvatar
     * @description Upload new avatar.
     * @body params:
     *   {file} avatar new avatar
     * @policies
     *   verifyToken
     */

    changeAvatar: asyncWrap(async (req, res) => {
        let options = {
            req,
            inputName: "avatar"
        };
        let avatar = await UploadService.upload(options);
        let _id = req.user._id;
        await User.update({_id}, {$set: {avatar: avatar[0]}});
        let user = await User.findOne({_id}).select(fieldUser);
        res.ok({data:user});
    }),

    image: asyncWrap(async (req, res) => {
        let path = req.path.split("/api/v1/image")[1];
        sails.log(process.cwd()+'/.tmp'+path);
        res.sendfile(process.cwd()+'/.tmp'+path);
    }),

    /**
     * Function changeNickname
     * @description Change new nickname.
     * @body params:
     *   {String} nickname new nickname
     * @policies
     *   verifyToken
     *   validator/user/changeNickname
     */

    changeNickname: asyncWrap(async (req, res) => {
        const nickname = req.body.nickname;
        const id = req.user._id;
        const user = await UserRepository.changeNickname(nickname, id);
        return res.ok({data:user});
    }),

    /**
     * Function addressList.
     * @description Get all list address of user.
     * @policies
     *   verifyToken
     */

    addressList: asyncWrap(async (req, res) => {
        const id = req.user._id;
        const address = await AddressRepository.listByUser(id);
        return res.ok({data:address});
    }),

    /**
     * Function searchAddressByPostCode.
     * @description Search address via postcode.
     * @query Params
     *   {Number} postcode Postcode using search
     * @policies
     *   /validator/user/checkPostcode
     */

    searchAddressByPostCode: asyncWrap(async (req, res) => {
        let postcode = parseInt(req.query.postcode);
        let address = await AddressRepository.searchByPostCode(postcode);
        return res.ok({data:address});
    }),

    /**
     * Function createAddress.
     * @description Create new address.
     * @body Params:
     *   {String} fullname Fullname of user
     *   {String} phone phone of user
     *   {String} address address of user
     *   {Number} postcode postcode
     *   {String} province province
     *   {String} district district
     *   {String} town town
     *   {String} note note
     *   {Boolean} isDefault Set address is default
     * @policies
     *   verifyToken
     *   /validator/address/createAddress
     */

    createAddress: asyncWrap(async (req, res) => {
        let body = {...req.body};
        body["user"] = req.user._id;
        let address = await AddressRepository.create(body);
        res.ok({data:address});
    }),

    /**
     * Function editAddress.
     * @description Edit address.
     * @Route params:
     *   {ObjectId()} id Id of address
     * @body params:
     *   {String} fullname Fullname of user
     *   {String} phone phone of user
     *   {String} address address of user
     *   {Number} postcode postcode
     *   {String} province province
     *   {String} district district
     *   {String} town town
     *   {String} note note
     *   {Boolean} isDefault Set address is default
     * @policies
     *   verifyToken
     *   /validator/address/createAddress
     *   /validator/address/checkAddress
     */

    editAddress: asyncWrap(async (req, res) => {
        let id = req.params.id;
        let user = req.user._id;
        let body = {...req.body};
        let address = await AddressRepository.edit(body, id, user);
        if(address === false) {
            return res.badRequest(sails.errors.addressNotExist);
        }
        return res.ok({data:address});
    }),

    /**
     * Function deleteAddress.
     * @description Delete address.
     * @Route params:
     *   {ObjectId()} id Id of address
     * @body params:
     *   {String} fullname Fullname of user
     *   {String} phone phone of user
     *   {String} address address of user
     *   {Number} postcode postcode
     *   {String} province province
     *   {String} district district
     *   {String} town town
     *   {String} note note
     *   {Boolean} isDefault Set address is default
     * @policies
     *   verifyToken
     *   /validator/address/checkAddress
     */

    deleteAddress: asyncWrap(async (req, res) => {
        let id = req.params.id;
        let user = req.user._id;
        let address = await AddressRepository.delete(id, user);
        if(address === false) {
            return res.badRequest(sails.errors.addressNotExist);
        }
        return res.ok({message: "delete_address_success"});
    }),

    /**
     * Function getPointAndCoin.
     * @description Get info point and coin.
     * @policies
     *   verifyToken
     */

    getPointAndCoin: asyncWrap(async (req, res) => {
        let user = req.user._id;
        let coin = await AuctionRepository.getDepositBalanceByUser(user);
        let point = await PointRepository.pointByUser(user);
        let data = {
            coin,
            point
        };
        return res.ok({data});
    }),

    /**
     * Function coinExchange
     * @description Exchange point to coin.
     * @body params:
     *   {Number} point point exchange to coin
     * @policies
     *   verifyToken
     *   /validator/point/checkPoint
     */

    coinExchange: asyncWrap(async (req, res) => {
        const user = req.user._id;
        const point = req.body.point;
        const result = await CoinRepository.coinExchange(user, point);
        if(result === true) {
            return res.ok();
        } else {
            return res.badRequest(result);
        }
    }),

    /**
     * Function coinExchangeHistory
     * @description History coin exchange
     * @policies
     *   verifyToken
     */

    coinExchangeHistory: asyncWrap(async (req, res) => {
        let user = req.user._id;
        let history = await CoinRepository.coinExchangeHistory(user);
        return res.ok({data:history});
    }),

    /**
     * Function friendList
     * @description Get friend list
     * @policies
     *   verifyToken
     */

    friendList: asyncWrap(async (req, res) => {
        let user = req.user._id;
        let friends = await FriendRepository.friendListByUser(user);
        return res.ok({data:friends});
    }, (req, res, error) => {
        if (error.code === sails.errors.userWithoutAnyFriend.code)
            return res.badRequest(sails.errors.userWithoutAnyFriend);
        res.serverError(error);
    }),

    /**
     * Function pointHistory.
     * @description Get point history of user.
     * @policies
     *   verifyToken
     */

    pointHistory: asyncWrap(async (req, res) => {
        const user = req.user._id;
        const points = await PointRepository.pointHistoryByUser(user);
        console.log('Point history: ', points);
        return res.ok({data:points});
    }),

    /**
     * Function checkin.
     * @description User checkin when login app.
     * @policies
     *   verifyToken
     */

    checkin: asyncWrap( async (req, res) => {
        let user = req.user._id;
        let checkin = await PointRepository.checkin(user);
        if(checkin === true) {
            return res.ok();
        } else {
            return res.badRequest(sails.errors.checkinFail);
        }
    }),

    /**
     * Function auctionHistory.
     * @description Get my auction chance buy history.
     * @query params
     *   {Number} page page in pagination
     * @policies
     *   verifyToken
     *
     */

    auctionHistory: asyncWrap(async (req, res) => {
        let id = req.user._id;
        let page = req.query.page !== undefined ? req.query.page : 1;
        let userAuctionBuy = await AuctionRepository.auctionHistoryByUser(id, page);
        res.ok({data: userAuctionBuy});
    }),

    /**
     * Function myAuctionHistoryById.
     * @description Get detail auction chance buy.
     * @Route params
     *   {ObjectId()} auctionid Id of auction
     * @policies
     *   verifyToken
     */

    myAuctionHistoryById: asyncWrap(async (req, res) => {
        let auction = req.params.auctionid;
        let user = req.user._id;
        let userChanceBuys = await AuctionRepository.auctionByUser(auction, user);
        res.ok({data:userChanceBuys});
    }),

    /**
     * Function myWinAuctionHistory.
     * @description Get my win auction history.
     * @query params
     *   {Number} page page in pagination
     * @policies
     *   verifyToken
     */

    myWinAuctionHistory: asyncWrap(async (req, res) => {
        let id = req.user._id;
        let page = req.query.page !== undefined ? req.query.page : 1;
        let auctionWinners = await AuctionRepository.winAuctionHistoryByUser(id, page);
        res.ok({data:auctionWinners});
    }),

    /**
     * Function myReviewList.
     * @description get list my review auction.
     * @query params
     *   {Number} page page in pagination
     */

    myReviewList: asyncWrap(async (req, res) => {
        const userId = req.user._id;
        const me = req.user._id;
        const page = req.query.page ? req.query.page : 1;
        const reviews = await ReviewRepository.reviewByUser(userId, me, page);
        console.log({ reviews });
        return res.ok({data: reviews});
    }),

    /**
     * Function favoriteList.
     * @description get favorite product list of user.
     * @policies
     *   verifyToken
     */

    favoriteList: asyncWrap(async (req, res) => {
        let id = req.user._id;
        let favorites = await FavoriteRepository.favoriteList(id);
        return res.ok({data:favorites});
    }),

    /**
     * Function createFavorite.
     * @description create new favorite.
     * @body params
     *   {String} name name of product
     *   {String} url url of product
     * @policies
     *   verifyToken
     *   validator/user/createFavorite
     */

    createFavorite: asyncWrap(async (req, res) => {
        let id = req.user._id;
        let params = {...req.body};
        params.user = id;
        let favorite = await FavoriteRepository.create(params);
        return res.ok({data:favorite});
    }),

    // get coin
    getCoin: asyncWrap(async (req,res) => {
        let coin = req.body.coin > 10000 ? 10000:req.body.coin;
        let point = coin*100;
        let user = req.user._id;
        let userCoin = await UserCoin.findOne({user}).lean(true);
        if(!userCoin) {
            await UserCoin.create({
                user,
                coin
            });
        } else {
            await UserCoin.update({user}, {$set:{coin:coin}});
        }

        let userPoint = await UserPoint.findOne({user}).lean(true);
        if(!userPoint) {
            await UserPoint.create({
                user,
                point
            });
        } else {
            await UserPoint.update({user}, {$set:{point:point}});
        }

        return res.ok({
            data: {
                coin,
                point
            }
        });
    })
};
