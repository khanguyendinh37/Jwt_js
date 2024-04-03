const express = require("express");
const cors = require ("cors");
const dotenv = require ("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRourte = require("./routes/user");

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log("MONGODB CONNECTED...");
})
.catch(()=>{
    console.log("MONGOODB CONNECTED ERROR!");
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());

//routers use
app.use("/v1/auth",authRoute);
app.use("/v1/user",userRourte);
app.listen(8000, ()=>{
    console.log("Server is running")
})
//Authentication->kiểm tra so sánh dữ liệu
//Authoriation->phân quyền
//Json web token->chứng thực người dùng