const Product=require("../models/product");
exports.getProducts=(async(req,res,next)=>{
    try{
        const products=await Product.find();
        res.status(200).json(products);
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

    
     const product=await Product.create(req.body);
    
    return res.status(201).json(product);
    }
    catch(error){
        next(error);
    }
});
exports.updateProduct=( async (req, res,next) => {
    try {
        const id = req.params.id;

        const product = await Product.findByIdAndUpdate(id, req.body, {
            returnDocument: "after", runValidators: true
        });
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);
    } catch(err) {
        next(err);
    }
});
exports.deleteProduct=( async (req, res,next) => {
    try{
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.status(200).json({
        message: "Product deleted successfully"
    })
    }
    catch(error){
        next(error);
    }
});