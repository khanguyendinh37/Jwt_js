const {json} = require("express");
const User  = require("../models/User");
const bcrypt = require("bcrypt");
const UserContronller = {
    //List User
    listUser :async(req,res) => {
        try {
            const user = await User.find();
            
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    deleteUser:async(req,res) =>{
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Delete successfully");

        }catch(err){
            res.status(500).json("Delete not Success");
        }
    },
    getUser: async (req,res)=>{
      try {
          if(req.params.id){
            const user = await User.findById(req.params.id);
            res.status(200).json(user);
          }
      } catch (error) {
        res.status(500).json(error);
      }
    },
    updateUser:async (req,res) =>{
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            const upuser = await new User({
                username: req.body.username,
                email :req.body.email,
                password: hashed,
                _id:req.params.id

            });
            const _id = req.params.id;
            try {
                // Cập nhật thông tin người dùng dựa trên ID
               
                const updatedUser = await User.findByIdAndUpdate(
                   _id, // ID của người dùng cần cập nhật
                    upuser, // Dữ liệu cập nhật
                    { new: true } // Tùy chọn để trả về người dùng đã được cập nhật
                );
                if (updatedUser) {
                    
                    res.status(200).json(updatedUser);
                } else {
                  
                    res.status(404).send('Không tìm thấy người dùng để cập nhật');
                }
            } catch (error) {
                
                res.status(500).json(error);
            }
           
           
        } catch (error) {
            res.status(400).json(error);
        }
    },
    
}
module.exports = UserContronller;