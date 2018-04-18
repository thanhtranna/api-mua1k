'use strict';

module.exports = {
  /**
   * Get campaigns
   */
  getCampaigns: asyncWrap(async (req, res) => {
    let campaigns = await CampaignRepository.getCampaigns();

    res.ok({ data: campaigns });
  })
};
