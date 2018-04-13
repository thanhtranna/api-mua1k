/**
 * Created by daulq on 9/25/17.
 */

const fieldUser = "_id nickname email avatar uid";
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
            const dataSave = {
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
     * @param timestamp
     * @returns {Promise.<*|Promise>}
     */

    getMessages: async(timestamp) => {
        try {
            let userBlockIds = await User.find({isBlocked: true}).select('_id');
            let arrayUserBlockIds = sails.helpers.transferToArrayValue(userBlockIds);
            let options = {
                select: fieldMessage,
                populate: [
                    {
                        path: "user",
                        select: fieldUser
                    }
                ],
                lean: true,
                limit: 20,
                sort: {
                    "createdAt": -1
                }
            };
            let messages = await MessageChat.paginate({
                user: { $nin: arrayUserBlockIds },
                createdAt: {$lt: timestamp}
            }, options);
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
