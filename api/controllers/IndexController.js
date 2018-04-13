/**
 * IndexController
 *
 * @description :: Server-side logic for managing indices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * Function contactCategoryList.
     * @description get contact categories.
     */

    contactCategoryList: asyncWrap(async (req, res) => {
	    let categories = await CommonRepository.contactCategoryList();
	    return res.ok({data:categories});
    }),

    /**
     * Function createContact.
     * @description Create new contact.
     * @body params:
     *   {String} email email of user.
     *   {String} content content of contact
     *   {ObjectId()} contactCategory id of category.
     * @policies
     *   /validator/common/createContact
     */

    createContact: asyncWrap(async (req, res) => {
        let params = {
            category: req.body.contactCategory,
            email: req.body.email,
            content: req.body.content,
        };
        let contact = await CommonRepository.create(params);
        return res.ok({data:contact});
    })
};

