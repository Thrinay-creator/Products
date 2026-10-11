const Product=require("../models/product");
exports.getProducts=(async(req,res,next)=>{
    try{
        const {search,inStock,minPrice,maxPrice,sort}=req.query;
        const page=Number(req.query.page) || 1;
        const limit=Number(req.query.limit) || 15;

        const filter={};
        if(search){
            const safe=search.replace(
                /[.*+^${}[]()|[\] \\]/g,"\\$&"
            );
            filter.name={
                $regex:safe,$options:"i"
            };
        }
        if(inStock){
            filter.inStock= inStock === "true";
        }
        if(minPrice || maxPrice){
            filter.price={};
            if(minPrice) filter.price.$gte =Number(minPrice)
            if(maxPrice) filter.price.$lte=Number(maxPrice)
        }


        const total=await Product.countDocuments(filter);
        const results=await Product.find(filter)
                                                .sort(sort || "-createdAt")
                                                .skip((page-1)*limit)
                                                .limit(limit);
        res.json({
            total,
            page,
            pages:Math.ceil(total/limit),
            results,
        });
    }
    catch(error){
        next(error);
    }
});
exports.getProduct=(async(req,res,next)=>{
    try{
    const id=req.params.id; 
    const product=await Product.findById(id);
    if(!product){
        return res.status(404).json({
            message:"products not found",
            error:"in the routes file"
        });
    }
    res.status(200).json(product);
    }
    catch(error){
        next(error);
    }
});
exports.getMyProducts=async(req,res,next)=>{
    try{
        const products=await Product.find({createdBy:req,userid});
        res.status(200).json(products);
    }
    catch(err){
        next(err)
    }
}
exports.createProduct=(async(req,res,next)=>{
    try{
        const{name,price}=req.body;
        if(!name ){
            return  res.status(400).json({       
                message: "name is  required"
            })
        }
    if(!price ){
      return   res.status(400).json({
            message: "price is  required"
        })
    }

    
     const product=await Product.create({
        ...req.body,
        createdBy: req.user.id
    });  
    
    return res.status(201).json(product);
    }
    catch(error){
        next(error);
    }
});
exports.updateProduct=( async (req, res,next) => {
    try {
       

        const product = await Product.findByIdAndUpdate(req.params.id);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        if(String(product.createdBy) !== req.user.id){
            return res.status(403).json({
                error:"You can only change your own products"
            })
        }
        delete req.body.createdBy;
        const updated=await Product.findByIdAndUpdate(
            req.params.id,req.body,
            { returnDocument:"after",runValidators:true }
         );
         res.json(updated);
    } catch(err) {
        next(err);
    }
});
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