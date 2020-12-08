const User = require('../../models/user')
const bcrypt = require('bcrypt');
const passport = require('passport');

const authController =()=>{

    const getRedirectUrl = (req)=>{

        return req.user.role === 'worker' ? '/worker/orders' :'/customer/orders'

    }

    return {
        login :(req , res)=>{
            res.render('auth/login');
        },
        postlogin(req,res ,next){
            //console.log(req)
            passport.authenticate('local' ,(err , user ,info)=>{
                if(err ){
                    req.flash('error' , info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error' ,info.message)
                    res.redirect('/login')
                }
              req.logIn(user ,(err)=>{
                  if(err){
                    req.flash('error' , info.message)
                    return next(err)
                  }
                console.log("ok evrything fine")


                  return res.redirect(getRedirectUrl(req))


              })   
             
            })(req , res ,next)
        },

        register:(req , res)=>{
            res.render('auth/register');
        }
        ,
        async postRegister(req , res){
           
            const{name ,username,email  ,password} = req.body ;
            //validating request
            if(!name || !email ||!password){
                req.flash('error' , 'Fill all required fields ')
                req.flash('name' ,name)
                req.flash('username' ,username)
                req.flash('email' , email)
                return res.redirect('/register')

            }
           //Unique Email checker
           User.exists({email :email} ,(err , result ,next)=>{
               
            if(result){
                req.flash('error' , 'Email Already in use ')
                req.flash('name' ,name)
                req.flash('username' ,username)
                req.flash('email' , email)
                return res.redirect('/register')
            }
           })
           //hash or encrypt the password

           const hashedPassword = await bcrypt.hash(password , 10)

           // Create a User in database

           const user = new User({
               name : name ,
               username :username,
               email : email ,
               password : hashedPassword
           })
           
           user.save().then((user)=>{
             
            return res.redirect('/')

           }).catch( err =>{
            console.log(err)
            req.flash('error' , 'Something Went wrong on our end ')
            return res.redirect('/register')

           })
            console.log(req.body)

        } ,
        logout(req , res ){
            req.logout()
            delete req.session.cart
            return res.redirect('/login')
        }
    }
}

module.exports=authController;