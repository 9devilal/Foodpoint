const Order = require('../../../models/order')
const moment= require('moment')

const orderController =()=>{
 return{
     store(req , res){
          console.log(req.body)
        // Validate request 
        const{phone , address} = req.body
       
        if(!phone || !address){
            req.flash('error' , 'All fields required')
            return res.redirect('/cart')
        }
    
        const order = new Order({
            customerId : req.user._id ,
            items : req.session.cart.items,
            phone:phone,
            address:address
        })

        order.save().then(result=>{
            Order.populate(result , {path :'customerId'},(err , placedOrder)=>{
               
                req.flash('success' ,'order placed successfully')
                
                //Emit
                const eventEmitter =req.app.get('eventEmitter')
                eventEmitter.emit('orderPlaced' , placedOrder)
                console.log('Result at ' + placedOrder)
                delete req.session.cart
                return res.redirect('/customer/orders')
            })


        }).catch(err =>{
            req.flash('error' , 'Something went wrong')
            res.redirect('/cart')
        })
      
     } ,
     async index(req,res){
         
        const orders = await Order.find({ customerId : req.user._id} ,
             null ,
             {sort :{'createdAt' :-1}})
        //console.log(orders)

        res.render('customers/orders' ,{orders : orders ,moment : moment})

     },
     async show(req , res) {
         const order =await Order.findById(req.params.id)
         //Check if the orderId belongd to user
        // if(req.user._id.toString() === order.customerId.toString()){
            
            return res.render('customers/singleOrder' ,{order : order})

        // }
         return res.redirect('/')
     }
 }
}


module.exports=orderController