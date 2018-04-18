'use strict';

const userModel = { path: 'user', select: 'id nickname' },
  auctionModel = { path: 'auction', select: 'id' };

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
    let name = req.query.name,
      query = {},
      page = req.query.page || 1;
    if (typeof name != 'undefined') {
      query.name = new RegExp(name);
    }
    let reviews = await Review.paginate(
      query,
      sails.helpers.optionPaginateAdmin(req, [userModel, auctionModel], page)
    );
    res.ok({ data: reviews });
  }),

  /**
   * block review
   */
  blockReview: asyncWrap(async (req, res) => {
    let id = req.params.id;
    let review = await Review.findByIdAndUpdate(
      id,
      { $set: { status: 0 } },
      { new: true }
    );
    res.ok({ data: review });
  }),

  /**
   * block review
   */
  approveReview: asyncWrap(async (req, res) => {
    let id = req.params.id;
    let review = await Review.findByIdAndUpdate(
      id,
      { $set: { status: 1 } },
      { new: true }
    );
    res.ok({ data: review });
  }),

  deleteReview: asyncWrap(async (req, res) => {
    let id = req.params.id;
    let deletedAt = new Date();
    let review = await Review.findByIdAndUpdate(
      { _id: id },
      { $set: { deletedAt } },
      { new: true }
    );
    res.ok({ data: review });
  })
};
