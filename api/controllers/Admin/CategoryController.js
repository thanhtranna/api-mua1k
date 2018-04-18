/**
 * Admin CategoryController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /**
   *  get categories
   */
  getCategories: asyncWrap(async (req, res) => {
    const categories = await Category.find({});
    res.ok({ data: categories });
  }),

  /**
   * create a new category
   */
  postCategory: asyncWrap(async (req, res) => {
    const cate = req.body;
    options = {
      req: req,
      inputName: 'icon'
    };
    let upload = await UploadService.upload(options);
    sails.log.debug(upload[0]);
    cate.icon = upload[0];
    let cat = await Category.create(cate);
    res.ok({ data: cat });
  }),

  /**
   * get paginate category product
   */
  getProductCategories: asyncWrap(async (req, res) => {
    const page = req.query.page || 1;
    const data = await Category.paginate(
      {},
      sails.helpers.optionPaginateAdmin(req, [], page)
    );
    res.ok({ data: data });
  }),

  /**
   * deleted category product
   */
  putProductCategory: asyncWrap(async (req, res) => {
    const { id } = req.params;
    const cat = await Category.findByIdAndUpdate(
      id,
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
    res.ok({ data: cat });
  })
};
