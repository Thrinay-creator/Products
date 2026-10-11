const express=require("express");
const app=express();
const port=3000;
app.use(express.json());


app.use((req,res,next) =>{
    console.log(`${req.method} ${req.url}`);
    next();
});


app.get("/" , (req,res)=>{
    res.send("HI These is Thrinay");
});

app.get("/contacts",(req,res)=>{
    res.send("Contacts Page.");
});

app.get("/privacy" ,(req,res)=>{
    res.send("Privacy Page");
});
app.get("/api/hello" ,(req,res)=>{
    res.json({message:"Hello from the server!", ok:true });
});
app.get("/api/missing" ,(req,res)=>{
    res.status(200).json({message:"Hi How are you!",  });
});

app.get("/products/:id" ,(req,res)=>{
    const productId=req.params.id;
    res.status(200).json({message:`Product ID is ${productId}`});
});
app.get("/users/:userId/orders/:orderId",(req,res)=>{
    const userId=req.params.userId;
    const orderId=req.params.orderId;
    res.status(200).json({message:`User ID is ${userId} and Order ID is ${orderId}`});
});
app.get("/search",(req,res)=>{

    const category=req.query.category;
    const  maxPrice=req.query.maxPrice;

    res.status(200).json({message:`Category is ${category} and maxPrice is ${maxPrice}`});
});
app.post("/login" ,(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    res.status(200).json({
        "email":`Email is ${email}`, "message": 'Login successful'
    });
});



app.use((req,res)=>{
    res.status(404).send("404 Page Not Found");
});


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});