const Product = require("../models/product");

exports.getProducts = async (req, res, next) => {
    try {
        const {search,inStock,minPrice,maxPrice,sort} = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const filter = {};
        if (search) {
            const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
            filter.name = {
                $regex: safeSearch, $options: "i"
            };
        }
        if (inStock !== undefined) {
            filter.inStock = inStock === "true";
        }
        if(minPrice || maxPrice){
            filter.price = {};
            if(minPrice) {
                filter.price.$gte = parseFloat(minPrice);
            }
            if(maxPrice) {
                filter.price.$lte = parseFloat(maxPrice);
            }
        }

        const total = await Product.countDocuments(filter);
        const results = await Product.find(filter)
                                      .sort({ [sort || "-createdAt"]: 1 }) 
                                      .skip((page - 1) * limit)
                                      .limit(limit);    
        res.status(200).json({
            products: results,
            total,
            page,
            limit
        });
    } catch(err) {
        next(err);
    }
}

exports.getProduct = async (req, res, next) => {
    try {
        const id = req.params.id;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);
    } catch(err) {
        next(err);
    }
}

exports.getMyProducts = async (req, res, next) => {
    try {
        const products = await Product.find({createdBy: req.user.id})
        res.status(200).json(products);
    } catch(err) {
        next(err);
    }
}

exports.createProduct = async (req, res, next) => {
   try {
        const {name, price} = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Name not found"
            })
        }

        if (!price) {
            return res.status(400).json({
                message: "price not found"
            })
        }

        const product = await Product.create({
            ...req.body, 
            createdBy: req.user.id
        })
        return res.status(201).json(product);
   } catch (err) {
        next(err);
   }
}

exports.updateProduct = async (req, res, next) => {
    try {
        const id = req.params.id;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (String(product.createdBy) !== req.user.id) {
            return res.status(401).json({
                message: "U can change ur own products"
            });
        }

        delete req.body.createdBy

        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
            returnDocument: "after",
            runValidators: true
        })
        res.status(200).json(updatedProduct);
    } catch(err) {
        next(err);
    }
}

exports.deleteProduct =  async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (String(product.createdBy) !== req.user.id) {
            return res.status(401).json({
                message: "u cant' delete other products"
            });
        }
        
        await product.deleteOne();
        res.status(200).json({
            message: "Product deleted successfully"
        })
    } catch (err) {
        next(err);
    }
}