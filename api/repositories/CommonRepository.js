/**
 * Created by daulq on 9/18/17.
 */

module.exports = {

    /**
     * Function contactCategoryList.
     * @description Get contact categories.
     * @returns {Promise.<*>}
     */

    contactCategoryList: async () => {
        try {
            let fieldCategory = "_id name";
            return await ContactCategory.find().select(fieldCategory);
        } catch(error) {
            throw error;
        }
    },

    /**
     * Function create.
     * @description Create new contact.
     * @param {Object} params
     *   {String} email email of user.
     *   {String} content content of contact
     *   {ObjectId()} contactCategory id of category.
     * @returns {Promise.<object>|contact}
     */

    create: async (params) => {
        try {
            let fieldContact = "_id email content";
            let contact = await Contact.create(params);
            contact = await Contact.findById(contact._id).select(fieldContact);
            return contact;
        } catch(error) {
            throw error;
        }
    }
}