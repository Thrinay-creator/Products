const express=require("express");
const app=express.Router();
const c=require("../controllers/productController");

app.get("/",c.getProducts);

app.get("/:id",c.getProduct);
app.post("/",c.createProduct);
app.put("/:id",c.updateProduct);
app.delete("/:id",c.deleteProduct);
module.exports = app;