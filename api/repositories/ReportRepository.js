/**
 * Created by daulq on 9/13/17.
 */


module.exports = {

    /**
     *
     * @param toUser
     * @param fromUser
     * @param content
     * @return {Promise.<number>}
     */
    postReport: async (toUser, fromUser, content) => {
        try {
            let report = await Report.create({toUser, fromUser, content});
            if(!report) {
                throw sails.helpers.generateError({
                    code: sails.errors.createReportFail.code,
                    message: 'Create report fail'
                });
            }
            return report;
        } catch (error) {
            throw error;
        }
    },

    /**
     *
     * @param toUser
     * @param fromUser
     * @return {Promise.<boolean>}
     */
    isReport: async (toUser, fromUser) => {
        try {
            let report = await Report.count({toUser, fromUser});
            if(report > 0) {
                return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    }
};
