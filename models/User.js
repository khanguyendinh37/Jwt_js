const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required : true,
        minlength:6,
        maxlength:20,
        unipue:true
    },
    email:{
        type: String,
        required : true,
        minlength:10,
        maxlength:50,
        unipue:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    admin:{
        type:Boolean,
        default:false
    }
},{timestamps:true});
module.exports = mongoose.model('User',userSchema);