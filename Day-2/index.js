const express=require("express");
const dotenv=require("dotenv");
const connectDB=require("./config/db");
const productsRoutes = require("./routes/products");
const errorHandler=require("./middleware/errorHandler");
const app=express();

dotenv.config();
app.use(express.json())
const port=process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.status(200).json({
        message: "working"
    });
});
app.use((req,res,next)=>{
    console.log(req.method);
    console.log(req.url)
    next();
})
app.use("/products", productsRoutes)


app.use((req, res) => {
    res.status(404).json({
        message: "Page not found"
    })
});

app.use(errorHandler);


app.listen(port,()=>{
    connectDB();
        console.log("server listening on port : "+port);
});