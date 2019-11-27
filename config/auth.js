// For Other Microservices where we return data only when we know user is logged in 
module.exports= {
    ensureAuthenticated:function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.redirect('/user/failedLogin');
    }
}