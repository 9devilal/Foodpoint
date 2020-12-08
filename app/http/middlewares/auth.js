const auth =(req , res ,next)=>{
  //  console.log('inhere')
    if(req.isAuthenticated()){
        //console.log('till here' + req.user)
        return next()
    }
    
    return res.redirect('/login')
    
}
module.exports=auth