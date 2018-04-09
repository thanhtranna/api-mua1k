/**
 * Created by daulq on 9/12/17.
 */

const fieldAddress = "-__v -createdAt -updatedAt";

module.exports = {

    /**
     * Function listByUser.
     * @description Get list address of user.
     * @param {ObjectId()} id id of user.
     * @returns {Promise.<Query|*>}
     */

    listByUser: async (id) => {
        try {
            return await UserAddress.find({user: id, deletedAt: undefined}).select(fieldAddress).lean();
        } catch (error) {
            throw error;
        }

    },

    /**
     * Function searchByPostCode.
     * @description Search address via postcode.
     * @param {ObjectId()} postcode postcode for search
     * @returns {Promise.<{}>}
     */

    searchByPostCode: async (postcode) => {
        try {
            let dataAddress = sails.helpers.addressByPostcode();
            let address = {};
            for(let i in dataAddress) {
                if(dataAddress[i].postcode === postcode) {
                    address = {...dataAddress[i]};
                }
            }
            return address;
        } catch (error) {
            throw error;
        }

    },

    /**
     * Function create
     * @description Create new address
     * @param {Object} body
     *   {String} body.fullname Fullname of user
     *   {String} body.phone phone of user
     *   {String} body.address address of user
     *   {Number} body.postcode postcode
     *   {String} body.province province
     *   {String} body.district district
     *   {String} body.town town
     *   {String} body.note note
     *   {Boolean} body.isDefault Set address is default
     * @returns {Promise.<body>}
     */

    create: async (body) => {
        try {
            let options = {
                new:true,
                multi:true
            };

            // Update all address isDefault=false if isDefault = true
            if(body.isDefault === "true") {
                body.isDefault = true;
                await UserAddress.update({user:body.user}, {$set:{isDefault:false}}, options);
            }
            let address =  await UserAddress.create(body);

            // Update address at users table.
            if(body.isDefault === "true") {
                await UserAddress.update({user:body.user}, {$set:{isDefault:false}}, options);
            }
            address = await UserAddress.findById(address._id).select(fieldAddress);
            return address;
        } catch(error) {
            throw error;
        }

    },

    /**
     * Function edit
     * @description Edit address of user.
     * @param {Object} body
     *   {String} body.fullname Fullname of user
     *   {String} body.phone phone of user
     *   {String} body.address address of user
     *   {Number} body.postcode postcode
     *   {String} body.province province
     *   {String} body.district district
     *   {String} body.town town
     *   {String} body.note note
     *   {Boolean} body.isDefault Set address is default
     * @param {ObjectId()} _id id of address
     * @param {ObjectId()} user id of user
     * @returns {Promise.<*>}
     */

    edit: async(body, _id, user) => {
        try {
            let options = {
                new: true,
                multi: true
            };
            let query = {
                user,
                _id
            };
            let address = await UserAddress.findOne(query);
            if(address) {
                await UserAddress.update(query, {$set:body}, options);
                return await UserAddress.findOne(query).select(fieldAddress);
            } else {
                return false;
            }
        } catch(error) {
            throw error;
        }
    },

    /**
     * Function delete
     * @description Delete address.
     * @param {ObjectId()} _id id of address
     * @param {ObjectId()} user id of address
     * @returns {Promise.<boolean>}
     */

    delete: async(_id, user) => {
        try {
            let options = {
                new: true,
                multi: true
            };
            let query = {
                user,
                _id
            };
            let address = await UserAddress.findOne(query);
            if(address) {
                await UserAddress.update(query, {$set:{deletedAt: new Date()}}, options);
                return true;
            } else {
                return false;
            }
        } catch(error) {
            throw error;
        }

    }
}