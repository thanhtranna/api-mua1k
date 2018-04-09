"use strict";

const PATH = {dirname: require('path').resolve(sails.config.appPath, '.tmp/uploads/origin')};
const CampaignRepository = {

    getCampaigns: async () => {
        try {
            return await Campaign
                .find({})
                .sort({createdAt: -1})
                .select('-__v -content')
                .limit(sails.config.limitCampaign);
        }
        catch (error) {
            throw error;
        }
    },

    getAdminCampaigns: async (page) => {
        try {
            let option = sails.helpers.optionPaginateCampaign(page);
            let campaigns = await Campaign.paginate({}, option);
            return campaigns;
        } catch (error) {
            throw error
        }
    },

    deleteCampaign: async (campaignId) => {
        try {
            let campaign = await Campaign.update({_id: campaignId}, {
                deletedAt: new Date()
            });
            if(!campaign)
                throw sails.helpers.generateError({
                    code: sails.errors.deleteCampaignFail.code,
                    message: 'Delete campaign fail'
                });
            return campaign;
        } catch (err) {
            throw err;
        }
    },

    filterCampaigns: async (type, page = 1, limit) => {
        try {
            console.log(type);
            let query = {};
            switch (type) {
                case `${sails.config.campaign.filter.notActive}`:
                    query = { status: sails.config.campaign.notActive };
                    break;
                case `${sails.config.campaign.filter.active}`:
                    query = { status: sails.config.campaign.active };
                    break;
                case `${sails.config.campaign.filter.static}`:
                    query = { type: sails.config.campaign.static };
                    break;
                case `${sails.config.campaign.filter.dynamic}`:
                    query = { type: sails.config.campaign.dynamic };
                    break;
            }
            let option = sails.helpers.optionPaginateCampaign(page);
            let campaigns = await Campaign.paginate(query, option);
            return campaigns;
        } catch (err) {
            throw err;
        }
    },

    createCampaign: async (req) => {
        try {
            let data = req.body;
            let options = {
                req: req,
                inputName: 'banner',
                config: PATH
            };
            let upload = await UploadService.upload(options);
            data.banner = upload;
            let campaign = await Campaign.create(data);
            if (!campaign) {
                DeleteImageService.deleteOldImage(upload.origin);
                throw sails.helpers.generateError({
                    code: sails.errors.createCampaignFail.code,
                    message: 'Create campaign fail'
                });
            }
            return campaign;
        } catch (err) {
            throw err;
        }
    },

    updateCampaign: async (req, id) => {
        try {
            let data = req.body;
            let options = {
                req: req,
                inputName: 'banner',
                config: PATH
            };
            let promise = await Promise.all([
                Campaign.findOne({'_id': id}),
                UploadService.upload(options)
            ]);
            data.banner = promise[1];
            let campaign = await Campaign
                .findByIdAndUpdate(id, {$set: data}, {new: true});
            if (!campaign)
                throw sails.helpers.generateError({
                    code: sails.errors.updateCampaignFail.code,
                    message: 'Update campaign fail'
                });
            DeleteImageService.deleteOldImage(promise[0].banner.origin);
            return campaign;
        } catch (err) {
            throw err;
        }
    }
};

module.exports = CampaignRepository;
