/**
 * AuctionController
 *
 * @description :: Server-side logic for managing contacts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  postContactCategory: asyncWrap(async (req, res) => {
    const params = req.body;
    const cate = await ContactCategory.create(params);
    res.ok({ data: cate });
  }),

  getContactCategories: asyncWrap(async (req, res) => {
    const page = req.query.page || 1;
    const data = await ContactCategory.paginate(
      {},
      sails.helpers.optionPaginateAdmin(req, [], page)
    );
    res.ok({ data: data });
  }),

  putContactCategory: asyncWrap(async (req, res) => {
    const param = req.body;
    const { id } = req.params;
    const cateNew = await ContactCategory.findByIdAndUpdate(
      id,
      { $set: param },
      { new: true }
    );
    res.ok({ data: cateNew });
  }),

  deleteContactCategory: asyncWrap(async (req, res) => {
    const { id } = req.params;
    const cateNew = await ContactCategory.findByIdAndUpdate(
      id,
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
    res.ok({ data: cateNew });
  }),

  getContactCategory: asyncWrap(async (req, res) => {
    const { id } = req.params;
    const cate = await ContactCategory.findById(id);
    res.ok({ data: cate });
  })
};
