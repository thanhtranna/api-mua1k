/**
 * Created by daulq on 9/25/17.
 */

const fieldUser = "_id nickname email avatar";
const fieldMessage = "-updatedAt -__v";

module.exports = {

    /**
     * Function sendMessage.
     * @description send message
     * @param {Object} user
     * @param {String} message
     * @param {Number} type
     * @returns {Promise.<boolean>}
     */

    sendMessage: async(user, message, type) => {
        try {
            let dataSave = {
                user: user._id,
                message: message,
                type
            };
            message = await MessageChat.create(dataSave);
            message = await MessageChat.findById(message._id)
                .select(fieldMessage)
                .populate({
                    path: "user",
                    select: fieldUser
                });
            await sails.sockets.blast("message", message);
            return true;
        } catch(error) {
            throw error;
        }
    },

    /**
     * Function getMessages.
     * @description get all messages.
     * @param {Number} page
     * @returns {Promise.<*|Promise>}
     */

    getMessages: async(page) => {
        try {
            let options = {
                select: fieldMessage,
                populate: [
                    {
                        path: "user",
                        select: fieldUser
                    }
                ],
                lean: true,
                page: page,
                limit: sails.config.paginateLimit,
                sort: {
                    "createdAt": -1
                }
            };
            let messages = await MessageChat.paginate({}, options);
            messages = messages.docs;
            await messages.sort((a,b) => {
                return a.createdAt - b.createdAt;
            });
            return messages;
        } catch (error) {
            throw error;
        }

    }
}