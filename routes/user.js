const userController = require("../contronllers/UserContronller");
const middiewereContronller = require("../contronllers/middiewereController");
const userrouter = require("express").Router();
//list user
userrouter.get("/",middiewereContronller.verifytoken,userController.listUser);

//get User
userrouter.get("/:id",middiewereContronller.verifytokenAdminAuth,userController.getUser);

//delete user
userrouter.delete("/:id",middiewereContronller.verifytokenAdminAuth,userController.deleteUser);

//update user 
userrouter.put("/:id",middiewereContronller.verifytokenAdminAuth,userController.updateUser);

module.exports = userrouter;