/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
"use strict";

const popCate = {path: 'category', select: 'name icon'},
      popCondition = {path : 'condition', select: 'name value'},
      PATH = {dirname: require('path').resolve(sails.config.appPath, '.tmp/uploads/origin')};

const filter = {
    category: 0,
    favorite: 1,
    deleted: 2
};

module.exports = {

    /**
     * Detail a product
     * @Query params: null
     * @Route params:
     *    {ObjectId} id: id of product
     * @Polices
     *    verifyToken.js
     *    validator.product.productExist.js
     * @return {json}
     */
    detailProduct: asyncWrap(async (req, res) => {
        let id = req.params.id;
        let product = await Product.findById(id).populate([popCate, popCondition]);
        res.ok({data: product});
    }),

    /**
     * Get all products
     * @Query params:
     *    {number} page: page number in pagination,
     *    {string} name: name of product
     * @Route params: null
     * @Polices
     *    verifyToken.js
     * @return {json}
     */
    getProducts: asyncWrap(async (req, res) => {
        let name = req.query.name,
            query = {},
            page = req.query.page || 1;
        if ( typeof name != 'undefined') {
            query.name = new RegExp(name);
        }
        let product = await Product.paginate(query, sails.helpers.optionPaginateAdmin(req, [popCate, popCondition], page));
        res.ok({data: product});
    }),

    /**
     * Filter products by category
     * @Query params:
     *    {number} page: page number in pagination,
     * @Route params:
     *    {Number} category : id of product category
     * @Polices
     *    verifyToken.js
     *    validator.product.filterProduct.js
     *    validator.product.categoryExist.js
     * @return {json}
     */
    getFilter: asyncWrap(async (req, res) => {
        let type = req.query.type;
        let query = {};
        let page = req.query.page || 1;

        switch (parseInt(type)){
            case filter.category:
                query = {
                    category: req.query.category
                };
                break;
            case filter.favorite:
                query = {
                    isFavorite: true
                };
                break;
            case filter.deleted:
                query = {
                    deletedAt: {$exists: true}
                };
                break;
            default:
                query = {}
        }
        let product = await Product.paginate(query, sails.helpers.optionPaginateAdmin(req, [popCate, popCondition], page));
        res.ok({data: product});
    }),

    /**
     * Create new a product
     * @Request params:
     *    {String}   name            : name of product | required
     *    {String}   description     : description of product | required
     *    {Number}   value           : value of c | required
     *    {Number}   chance          :  number of opportunities per product | required
     *    {Number}   quantity        : number remaining quantity of product | required
     *    {Float}    price           : price of product | required
     *    {Boolean}  isFavorite      : product is favorite
     *    {Number}   expDateNumber   : shelf life of the product | required
     *    {ObjectId} category        : array id category of product | required
     *    {ObjectId} condition       : id condition of product | required,
     *    {File}     images          : image of product | required,
     * @Polices
     *    verifyToken.js,
     *    validator/product/createProduct
     *    validator/product/categoryExist
     * @return {json}
     */
    postCreate : asyncWrap(async (req, res) => {
        let product = req.body,
            options = {
                req: req,
                inputName: 'images',
            };
        product.chanceNumber = Math.floor(req.body.price / sails.config.value1Chance);
        product.category = req.body.category.split(",");

        let upload = await UploadService.upload(options);
        sails.log.debug(upload);
        product.images = upload;
        product.featureImage = upload[0];
        let createProduct = await Product.create(product);
        if (!createProduct) {
            if (upload.length > 0) {
                upload.map(data => {
                    DeleteImageService.deleteOldImage(data.origin);
                });
            } else {
                DeleteImageService.deleteOldImage(upload.images.origin);
            }
        }
        res.ok({data: createProduct});
    }),

    /**
     * Update product
     * @Router params:
     *    {ObjectId} id : id of product
     * @Request params:
     *    {String}   name            : name of product | required
     *    {String}   description     : description of product | required
     *    {Number}   value           : value of c | required
     *    {Number}   chance          :  number of opportunities per product | required
     *    {Number}   quantity        : number remaining quantity of product | required
     *    {Float}    price           : price of product | required
     *    {Boolean}  isFavorite      : product is favorite
     *    {Number}   expDateNumber   : shelf life of the product | required
     *    {ObjectId} category        : id category of product | required
     *    {ObjectId} condition       : id condition of product | required,
     *    {File}     images          : image of product | required,
     * @Polices
     *    verifyToken.js,
     *    validator/product/productExist
     *    validator/product/updateCategory
     * @return {json}
     */
    postUpdate : asyncWrap(async (req, res) => {
        let id = req.params.id,
            product = req.body;
        if (req.body.isFile) {
            let options = {
                req: req,
                inputName: 'images',
                config: PATH
            };
            let upload = await UploadService.upload(options);
            product.images = upload;
            product.featureImage = upload[0];
        }

        if (req.body.price)
            product.chanceNumber = Math.floor(req.body.price / sails.config.value1Chance);

        if (req.body.category) {
            product.category = req.body.category.split(",");
        }

        let promise = await Promise.all([
            Product.findOne({'_id': id}),
            Product.findByIdAndUpdate(id, {$set: product}, {new: true})
                   .populate([popCate, popCondition])
        ]);
        if (!promise[1]) {
            if (promise[1].images.length > 0) {
                promise[1].images.map(data => {
                    DeleteImageService.deleteOldImage(data.origin);
                });
            } else {
                DeleteImageService.deleteOldImage(promise[1].images.origin);
            }
        } else {
            if (promise[0].images.length > 0) {
                promise[0].images.map(data => {
                    DeleteImageService.deleteOldImage(data.origin);
                });
            } else {
                DeleteImageService.deleteOldImage(promise[0].images.origin);
            }
        }
        res.ok({data: promise[1]});
    }),

    /**
     * Delete soft a product, update field deletedAt by now a day
     * @Query params: null
     * @Route params:
     *      {ObjectId} id: id of product,
     * @Polices
     *    verifyToken.js,
     *    validator/product/productExist
     * @return {json}
     */
    deleteProduct: asyncWrap(async (req, res) => {
        let id = req.params.id;
        let updateProduct = await Product.findByIdAndUpdate(id, {$set: {deletedAt: new Date()}}, {new: true});
        if (updateProduct) {
            if (updateProduct.images.length > 0) {
                updateProduct.images.map(data => {
                    DeleteImageService.deleteOldImage(data.origin);
                });
            } else {
                DeleteImageService.deleteOldImage(updateProduct.images.origin);
            }
        }
        res.ok({data: updateProduct});
    }),

    /**
     * - Choose a favorite product, it has value = true
     * - Destroy a favorite product , it has value = false
     * @Query params: null
     * @Route params:
     *      {ObjectId} id: id of product,
     * @Polices
     *    verifyToken.js,
     *    validator/product/productExist
     * @return {json}
     */
    favoriteProduct: asyncWrap(async (req, res) => {
        let id = req.params.id;
        let product = await Product.findById(id);
        let updateProduct = await Product.findByIdAndUpdate(
            id,
            {$set: {isFavorite : !product.isFavorite}},
            {new: true}
        );
        res.ok({data: updateProduct});
    }),

    /**
     * Get all products to Array
     * @Query params:
     * @Route params: null
     * @Polices
     *    verifyAdmin.js
     * @return {json}
     */
    getAuctionProducts: asyncWrap(async (req, res) => {
        let product = await Product
            .find({
                deletedAt: {$exists: false}
            })
            .select('_id name');
        res.ok({data: product});
    }),
};

