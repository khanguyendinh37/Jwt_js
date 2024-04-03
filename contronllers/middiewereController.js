const jwt = require("jsonwebtoken");

const middiewereController = {
    //verify Token
    
    verifytoken : (req, res, next)=>{
        const token = req.headers.token;
        if(token){
            //
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken,process.env.JWT_ACCESS_KEY,(err,user)=>{
                if(err){
                    res.status(403).json("Token is not valid");
                }
                req.user =user;
                next();
            })
        }else{
            res.status(401).json("you're not authenticate");
        }
    },
    verifytokenAdminAuth : (req,res,next)=>{
        middiewereController.verifytoken(req,res,()=>{
            if(req.user.id == req.params.id || req.user.admin){
                next();
            }else{
                res.status(403).json("you're not allowed to delete other");
            }
        })
    }
}
module.exports = middiewereController;