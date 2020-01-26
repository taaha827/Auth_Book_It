const mongoose = require('mongoose');

const userCredemtialSchema = mongoose.Schema({
   email:{
       type:String,
       required:true
   },
   password:{
       type:String,
       required:true
   },
   notificationToken:{
       type:String
   }
    
});


module.exports = mongoose.model("UserCredentials",userCredemtialSchema);