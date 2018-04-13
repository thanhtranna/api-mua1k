/**
 * ChargeController
 *
 * @description :: Server-side logic for managing charges
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	


  /**
   * Function index
   * @description Get coin charge
   * @return {object[]} coinCharge
   *
   */
  index: asyncWrap(async (req, res) => {
      let coinCharge = sails.helpers.coinCharge();
      return res.ok({data:coinCharge});
  })
};

