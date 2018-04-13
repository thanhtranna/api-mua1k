/**
 * Admin ConditionController
 *
 * @description :: Server-side logic for managing condition
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /**
     * Get all conditions
     * @Query params:
     *    {number} page: page number in pagination,
     * @Polices
     *    verifyAdmin.js
     * @return {json}
     */
    getConditions: asyncWrap(async (req, res) => {
        let page = req.query.page || 1;
        let conditions = await Condition.paginate({}, sails.helpers.optionPaginateAdmin(req, [], page));
        res.ok({ data:conditions });
    }),

    getConditionArray: asyncWrap(async (req, res) => {
        let data = await Condition.find({});
        res.ok({ data:data });
    }),
    /**
     * Detail a condition
     * @Route params:
     *    {ObjectId} id: id of condition
     * @Polices
     *    verifyAdmin.js,
     * @return {json}
     */
    getCondition:asyncWrap(async (req, res) => {
        let id = req.params.id;
        let condition = await Condition.findById(id);
        res.ok({ data:condition });
    }),
    /**
     * Create new a condition
     * @Request params:
     *    {String}   name           : name of condition | required
     *    {String}   value          : value of message | required
     * @Polices
     *    verifyAdmin.js,
     * @return {json}
     */
    postCreate: asyncWrap(async (req, res) => {
        let condition = req.body;
        let newCondition = await Condition.create(condition);
        res.ok({data : newCondition});
    }),
    /**
     * Delete soft a condition, update field deletedAt by now a day
     * @Query params: null
     * @Route params:
     *      {ObjectId} id: id of condition,
     * @Polices
     *    verifyAdmin.js,
     * @return {json}
     */
    deleteCondition: asyncWrap(async (req, res) => {
        let id = req.params.id;
        let newCondition = await Condition.findByIdAndUpdate(id, {$set : {deletedAt : new Date()}}, {new : true});
        res.ok({data : newCondition});
    }),
    /**
     * Update condition
     * @Router params:
     *    {ObjectId} id : id of condition
     * @Request params:
     *    {String}   name            : name of condition
     *    {String}   value          : value of condition
     * @Polices
     *    verifyAdmin.js,
     * @return {json}
     */
    putUpdate: asyncWrap(async (req, res) => {
        let id = req.params.id;
        let condition = req.body;
        let newCondition = await Condition
            .findByIdAndUpdate(id, {$set : condition}, {new : true});
        res.ok({data : newCondition});
    }),

};
