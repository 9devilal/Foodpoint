const Localpassport= require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')

const init =  (passport)=>{
//let mtc=false
    passport.use( new Localpassport({ usernameField : 'email' },async (email , password ,done)=>{

      //check if email exists
     const user = await User.findOne({email :email})
      if(!user){
        return done (null, false ,{message :'No user with given email'})
       
      }
    bcrypt.compare(password , user.password).then(match=>{
        if(match){
            return done(null , user ,{message : 'Logged In Successfully'})
        }

        return done(null , null ,{message :'wrong username or password'})
    }).catch( err =>{
        return done( null,false ,{message :'Something went wrong'})
    })
    }))
   
    passport.serializeUser((user ,done) =>{

       // console.log("this is id \n " + user._id)
       if(user)
           done(null , user._id)
    })

    passport.deserializeUser((id ,done)=>{
        User.findById(id , (err ,user)=>{
            done(err ,user)
        })
    })
   
}

module.exports=init