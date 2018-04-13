/**
 * AuctionController
 *
 * @description :: Server-side logic for managing contacts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    postContactCategory: asyncWrap(async (req, res) => {
        let params = req.body;
        let cate = await ContactCategory.create(params);
        res.ok({data : cate});
    }),

    getContactCategories: asyncWrap(async (req, res) => {
        let page = req.query.page || 1;
        let data = await ContactCategory.paginate({}, sails.helpers.optionPaginateAdmin(req, [], page));
        res.ok({data: data});
    }),

    putContactCategory: asyncWrap(async (req, res) => {
        let param = req.body;
        let id = req.params.id;
        let cateNew = await ContactCategory.findByIdAndUpdate(id, {$set: param}, {new: true});
        res.ok({data : cateNew});
    }),

    deleteContactCategory: asyncWrap(async (req, res) => {
        let id = req.params.id;
        let cateNew = await ContactCategory.findByIdAndUpdate(id, {$set: {deletedAt : new Date()}}, {new: true});
        res.ok({data : cateNew});
    }),

    getContactCategory : asyncWrap(async (req, res) => {
        let id = req.params.id;
        let cate = await ContactCategory.findById(id);
        res.ok({data : cate});
    }),
};

