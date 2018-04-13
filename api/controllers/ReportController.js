/**
 * AuctionController
 *
 * @description :: Server-side logic for managing auctions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * Create report user
     * @param userid: id user be report
     * @param content: content report
     */
    postReport: asyncWrap(async (req, res) => {
        let toUser = req.body.userid;
        let fromUser = req.user._id;
        let content = req.body.content;
        // check sent reported
        if (await ReportRepository.isReport(toUser, fromUser)) {
            return res.badRequest(sails.errors.sentReport);
        }
        let report = await ReportRepository.postReport(toUser, fromUser, content);
        res.ok({data: report});
    }, (req, res, error) => {
        if (error.code === sails.errors.createReportFail.code)
            return res.badRequest(sails.errors.createReportFail);
        res.serverError(error);
    }),
};

