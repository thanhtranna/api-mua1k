/**
 * Created by daulq on 9/7/17.
 */

const ReviewRepository = {

    getDetailReview: async (req) => {
        try {
            let reviewId = req.params.reviewid;

            let review = await Review
                .findById(reviewId)
                .populate('user', 'uid nickname avatar')
                .populate({
                    path: 'auction',
                    select: 'aid product luckyNumber finishAt',
                    populate: {
                        path: 'product',
                        model: 'Product',
                        select: 'name chanceNumber description'
                    }
                })
                .lean();

            review.totalLikes = await UserLike.count({review: reviewId});
            review.totalComments = await UserComment.count({review: reviewId});
            review.comments = await ReviewRepository.getCommentsOfReview(reviewId);

            if (req.user){
                let isUserLikeThisReview = await UserLike.count({review: reviewId, user: req.user.id});
                review.isLiked = !!isUserLikeThisReview;
            }

            return review;
        }
        catch (error) {
            throw error;
        }
    },

    /**
     * Function reviewByUser
     * @description Get all review of user
     * @param {Object()} id id of user
     * @param {Number} page page of pagination
     * @returns {Promise.<*|Promise>}
     */
    reviewByUser: async (id,me, page) => {
        try {
            const logAuctionWinner = await LogAuctionWinner.find({user:id}).lean(true);
            let auctionId = [];
            for(let i in logAuctionWinner) {
                auctionId.push(logAuctionWinner[i].auction);
            }
            let options = {
                select: [
                    "-updatedAt",
                    "-__v"
                ],
                limit: sails.config.paginateLimit,
                populate: [
                    {
                        path: "user",
                        select: "_id nickname email avatar"
                    }
                ],
                page: page,
                lean: true,
                sort: {
                    createdAt: -1
                }
            }
            let query = {
                user:id,
                auction: {
                    $in:auctionId
                },
                status: 1
            };
            let reviews = await Review.paginate(query, options);
            reviews = reviews.docs;
            for(let i in reviews) {
                reviews[i].totalLikes = await UserLike.count({review:reviews[i].id});
                let userLike = await UserLike.findOne({review:reviews[i].id, user:me});
                if (userLike) {
                    reviews[i].isLiked = true;
                } else {
                    reviews[i].isLike = false;
                }
                reviews[i].totalComments = await UserComment.count({review:reviews[i].id, status: 1});
            }
            return reviews;
        } catch (err) {
            throw err;
        }

    },

    /**
     * Function create.
     * @description Create new review.
     * @param {ObjectId()} auction
     * @param {ObjectId()} user
     * @param {Object} req
     *   {file} req.file.image file image
     *   {String} req.body.content Content review
     * @returns {Promise.<object>|review}
     */
    create: async (auction, user,req) => {
        try {
            let fieldReview = "-__v -updatedAt";
            let options = {
                req,
                inputName: "image"
            };
            let checkAuctionWinner = await LogAuctionWinner.findOne({user, auction});
            if(!checkAuctionWinner) {
                return sails.errors.noPermissionReview;
            }
            let checkReview = await Review.findOne({user, auction});
            if(checkReview) {
                return sails.errors.reviewExist;
            }

            let dataCreate = {
                auction,
                user,
                content: req.body.content,
                status: 1
            };

            if (req._fileparser.upstreams.length) {
                let image = await UploadService.upload(options);
                dataCreate.image = image[0];
            }

            let review = await Review.create(dataCreate);
            review = await Review.findOne({_id: review.id}).select(fieldReview);
            return review;
        } catch(error) {
            throw error;
        }

    },


    /**
     *
     * @return {Promise.<void>}
     */
    getReviews: async (page, auctionId, user) => {
        try {
            let query = {
                status: Review.status.approved,
                deletedAt: { $exists: false }
            };

            if (auctionId)
                query.auction = sails.helpers.toObjectId(auctionId);

            let reviews = await Review.aggregate([
                {
                    $match: query
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'users'
                    }
                },
                {
                    $lookup: {
                        from: 'usercomments',
                        localField: '_id',
                        foreignField: 'review',
                        as: 'allComments'
                    }
                },
                {
                    $lookup: {
                        from: 'userlikes',
                        localField: '_id',
                        foreignField: 'review',
                        as: 'userLikes'
                    }
                },
                {
                    $addFields: {
                        comments: {
                            $filter: {
                                input: '$allComments',
                                as: 'comment',
                                cond: { $eq: ['$$comment.status', 1] }
                            }
                        },
                    }
                },
                {
                    $addFields: {
                        user: { $arrayElemAt: ['$users', 0]},
                        totalComments: {$size: '$comments'},
                        totalLikes: {$size: '$userLikes'}
                    }
                },
                {
                    $project: {
                        'user.nickname': 1,
                        'user.avatar': 1,
                        'user._id': 1,
                        'user.uid': 1,
                        image: 1,
                        content: 1,
                        totalComments: 1,
                        totalLikes: 1,
                        createdAt: 1,
                        auction: 1
                    }
                },
                { $sort: { createdAt: -1} },
                { $skip: sails.helpers.getSkipItemByPage(page) },
                { $limit: sails.config.paginateLimit }
            ]);

            if (user){
                for (let i = 0; i < reviews.length; i++) {
                    let review = reviews[i];
                    let isUserLikeThisReview = await UserLike.count({review: review._id, user: user.id});
                    review.isLiked = !!isUserLikeThisReview;
                }
            }

            return reviews;
        }
        catch (error) {
            throw error;
        }
    },

    /**
     * Get comments of Review
     * @return {Promise.<void>}
     */
    getCommentsOfReview: async (reviewId, page) => {
        try {
            return await UserComment
                .find({
                    review: reviewId,
                    status: UserComment.status.approved,
                    deletedAt: { $exists: false }
                })
                .populate('user', 'nickname avatar')
                .select('user content createdAt')
                .sort({ createdAt: -1 })
                .skip(sails.helpers.getSkipItemByPage(page))
                .limit(sails.helpers.paginateLimit);
        }
        catch (error) {
            throw error;
        }
    }
};
module.exports = ReviewRepository;
