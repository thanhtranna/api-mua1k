"use strict";

const ContactRepository = {

    /**
     * Return array Contact
     * @param {Number} page
     * @return {Promise.<Object>}
     */
    getContacts: async (page = 1) => {
        try {
            let option = sails.helpers.optionPaginateContact(page);
            let contacts = await Contact.paginate({}, option);
            return contacts;
        } catch (err) {
            throw err;
        }
    },

    getContact: async id => {
        try {
            let contact = await Contact.getContact(id);
            return contact;
        } catch (err) {
            throw err;
        }
    },

    deleteContact: async (contactId) => {
        try {
            let contact = await Contact.update({_id: contactId}, {
                deletedAt: new Date()
            });
            if (!contact)
                throw sails.helpers.generateError({
                    code: sails.errors.deleteContactFail.code,
                    message: 'Delete contact fail'
                });
            return contact;
        } catch (err) {
            throw err;
        }
    },
};

module.exports = ContactRepository;
