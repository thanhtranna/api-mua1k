'use strict';

module.exports = {
  /**
   * Get detail review
   */
  getDetailReview: asyncWrap(async (req, res) => {
    let review = await ReviewRepository.getDetailReview(req);
    return res.ok({ data: review });
  }),

  /**
   * Get All Reviews
   */
  getAllReviews: asyncWrap(async (req, res) => {
    let page = req.query.page || 1;
    sails.log.debug(req.user);
    let reviews = await ReviewRepository.getReviews(page, null, req.user);
    res.ok({ data: reviews });
  }),

  /**
   * Get reviews of auction
   * @polices /auction/AuctionExist
   */
  getReviewsOfAuction: asyncWrap(async (req, res) => {
    let page = req.query.page || 1,
      auctionId = req.params.auctionid;
    let reviews = await ReviewRepository.getReviews(page, auctionId, req.user);
    res.ok({ data: reviews });
  }),

  /**
   * Get comments of review
   * @polices /review/checkReviewExist
   */
  getCommentsOfReview: asyncWrap(async (req, res) => {
    let reviewId = req.params.reviewid,
      page = req.query.page || 1;
    let comments = await ReviewRepository.getCommentsOfReview(reviewId, page);
    res.ok({ data: comments });
  }),

  /**
   * Function createReview.
   * @description create new review.
   * @Route params
   *   {ObjectId()} auctionid id of auction
   * @body params
   *   {String} content content review
   *   {file} image image upload
   * @policies
   *   verifyToken
   *   /validator/common/checkAuction
   *   /validator/auction/creteReview
   */

  createReview: asyncWrap(async (req, res) => {
    let id = req.params.auctionid;
    let user = req.user._id;
    let review = await ReviewRepository.create(id, user, req);
    if (review.code !== undefined) {
      return res.badRequest(review);
    }
    return res.ok({ data: review });
  }),

  /**
   * @polices
   *      verifyToken
   *      validator/review/checkReviewExist
   */
  createComment: asyncWrap(async (req, res) => {
    let comment = new UserComment({
      user: req.user._id,
      review: req.params.reviewid,
      content: req.body.content
    });
    await comment.save();

    res.created({ data: comment });
  }),

  /**
   * Like Review
   * Todo: fire socket
   * @polices
   *      verifyToken
   *      validator/review/checkReviewExist
   */
  likeAndUnlikeReview: asyncWrap(async (req, res) => {
    let likeData = {
      user: req.user._id,
      review: req.params.reviewid
    };

    // Get review object
    let review = await Review.findById(req.params.reviewid)
      .select('_id')
      .lean();

    // get total likes
    review.totalLikes = await UserLike.count({ review: review._id });

    // like & unlike
    let isLiked = await UserLike.count(likeData);
    if (isLiked) {
      await UserLike.findOneAndRemove(likeData);
      review.isLiked = false;
      review.totalLikes -= 1;
    } else {
      await UserLike.create(likeData);
      review.isLiked = true;
      review.totalLikes += 1;
    }

    res.ok({ data: review });
  })
};
