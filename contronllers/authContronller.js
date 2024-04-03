const { json } = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//create array save to token
let arrayRefrechToken = [];

const authContronller = {
    //Register
    registerUser: async (req,res)=>{
      
        try{
            //mã hõa Mk
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            // create new user
            const newUser = await new User({
                username: req.body.username,
                email :req.body.email,
                password: hashed,
            });
            //save to database
            const user = await newUser.save();
        
            return res.status(200).json(user);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    //access token ->token ngắn hạn
    generateAccessToken : (user) => {
        return jwt.sign(
            
            {
                id:user.id,
                admin:user.admin
            },
                    
            process.env.JWT_ACCESS_KEY,
            {
                //đặt thời hạn cho key
                expiresIn:"60s"
            });
    },
     // refresh token -> token giài hạn
    generateRefrechToken :(user) =>{
        return jwt.sign(
               {
                    id:user.id,
                    admin:user.admin
                },
              
                process.env.JWT_REFRECH_KEY,
                {
                    //đặt thời hạn cho key
                    expiresIn:"365d"
                });
    },
    //Login
    loginUser : async(req,res)=>{
        try {
            const user = await User.findOne({username: req.body.username});
           
            if(!user){
               return res.status(404).json('wrong username!');
            }
            const validPassword = await bcrypt.compare( 
                req.body.password,
                user.password
            );
            if(!validPassword){
                return res.status(404).json('wrong password');
            }

            if(user && validPassword){
                //kiểm soát và đăng nhập phân quyền jwt
                const accessToken = authContronller.generateAccessToken(user);
              
                const refreshToken = authContronller.generateRefrechToken(user);
                arrayRefrechToken.push(refreshToken);
                //lưu refreshToken vào cookies
                res.cookie("refreshToken",refreshToken,{
                    httpOnly:true,
                    //set lại true khi deploy code
                    secure:false,
                    path:'/',
                    sameSite:"strict",
                })
                //loại pass
                const {password,...rest} = user._doc
                res.status(200).json({...rest,accessToken});
            }
        } catch (error) {
            return res.status(500).json();
            
        }
    },
    //có thể dung redix để lưu vào data base để không bị trung lặp
    requestToken : async (req,res)=>{
        //take refresh token from user
        const refreshToken = req.cookies.refreshToken;
       
        if(!refreshToken) return res.status(401).json("you're not authentiacated");
        if(!arrayRefrechToken.includes(refreshToken)){
            return res.status(403).json("refresh token is not valid");
        }
        jwt.verify(refreshToken,process.env.JWT_REFRECH_KEY,(err,user)=>{
            if(err){
                console.log(err);
            }
            arrayRefrechToken = arrayRefrechToken.filter((token)=>token !== refreshToken);
            //Create new accessToken, refresh token
            const newAccessToken = authContronller.generateAccessToken(user);
            const newRefrechToken = authContronller.generateRefrechToken(user);
            //save new token
            arrayRefrechToken.push(newRefrechToken);
            //Save in cookies
            res.cookie("refreshToken",newRefrechToken,{
                httpOnly:true,
                secure : false,// set it to True  when go to live
                path:"/",
                sameSite:"strict"
            });
             res.status(200).json({accessToken:newAccessToken});
        })

    },
    userLogout :(req,res)=>{
        res.clearCookie("refreshToken");
        //nếu lưu accesstoken vào redux  store thì cần phải xóa nó dưới đây chỉ là luồng dữ liệu mẫu được lưu vào arr
        arrayRefrechToken.filter(token=>token  !== req.cookies.refreshToken);
        res.status(200).json("logout successfuly!");
    }
}
module.exports = authContronller;
//lưu token
/**
 * 1) lưu vào local strorege:
 * có thể bị tấn công xss
 * 2) lưu vào cookies:
 * có thể bị tấn công CSRF khắc phục ->Samesite nên dùng Httponly cookies
 * 3)redux strore để lưu accesstoken
 * Httponly cookies để lưu refrechToken
 * 
 * cách khắc phục duy nhât để tránh bị tấn công là dùng
 * Bff patten (backend for forntend)
 */