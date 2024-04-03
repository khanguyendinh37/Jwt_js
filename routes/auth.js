const authContronller = require("../contronllers/authContronller");
const middiewereContronller = require("../contronllers/middiewereController");

const router = require("express").Router();
//Register
router.post("/register",authContronller.registerUser);
//login
router.post("/login",authContronller.loginUser);
//Refesh
router.post("/refresh",authContronller.requestToken);
//logout
router.post("/logout",middiewereContronller.verifytoken,authContronller.userLogout);
module.exports = router;