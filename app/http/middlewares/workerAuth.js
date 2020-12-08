const workerAuth =(req , res ,next)=>{
    //  console.log('inhere')
      if(req.isAuthenticated() && req.user.role == 'worker'){
          //console.log('till here' + req.user)
          return next()
      }
      
      return res.redirect('/')
      
  }
  module.exports=workerAuth