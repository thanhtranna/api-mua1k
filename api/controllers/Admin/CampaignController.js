"use strict";

module.exports = {

    /**
     * Get campaigns
     */
    getCampaigns: asyncWrap(async (req, res) => {
        let page = req.query.page || 1;
        let campaigns = await CampaignRepository.getAdminCampaigns(page);
        res.ok({data: campaigns});
    }),

    /**
     * Get campaign
     */
    getCampaign: asyncWrap(async (req, res) => {
        let campaignId = req.params.id;
        let campaign = await Campaign.findById({'_id': campaignId}).select('-__v');
        res.ok({ data: campaign });
    }),

    /**
     * Post create campaign
     */
    postCreate: asyncWrap(async (req, res) => {
        let campaign = await CampaignRepository.createCampaign(req);
        res.ok({data: campaign});
    }, (req, res, error) => {
        if (error.code === sails.errors.createCampaignFail.code)
            return res.badRequest(sails.errors.createCampaignFail);
        res.serverError(error);
    }),

    /**
     * Put update campaign
     */
    putUpdate: asyncWrap(async (req, res) => {
        let campaignId = req.params.id;
        let campaign = await CampaignRepository.updateCampaign(req, campaignId);
        res.ok({data: campaign});
    }, (req, res, error) => {
        if (error.code === sails.errors.updateCampaignFail.code)
            return res.badRequest(sails.errors.updateCampaignFail);
        res.serverError(error);
    }),

    /**
     * Delete campaign
     */
    deleteCampaign: asyncWrap(async (req, res) => {
        let campaignId = req.params.id;
        let campaign = await CampaignRepository.deleteCampaign(campaignId);
        res.ok({ data: campaign });
    }, (req, res, error) => {
        if (error.code === sails.errors.deleteCampaignFail.code)
            return res.badRequest(sails.errors.deleteCampaignFail);
        res.serverError(error);
    }),

    /**
     * Filter campaign
     */
    filterCampaigns: asyncWrap(async (req, res) => {
        let page = req.query.page || 1;
        let type = req.query.type;
        let campaigns = await CampaignRepository.filterCampaigns(type, page);
        res.ok({ data: campaigns });
    })

};
