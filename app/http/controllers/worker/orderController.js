const order = require("../../../models/order");
const orderController = require("../customer/orderController");

const Order = require('../../../models/order')
const WorkerorderController = ()=>{
   return{
       index(req,res){
        
        Order.find({status :{$ne :'completed'}} , null ,{sort :{'createdAt':-1}}).
        populate('customerId' ,'-password').exec((err , orders)=>{
             if(req.xhr){
                 return res.json(orders)
             } 
            return res.render('worker/orders')

        })

       }
   }
}

module.exports=WorkerorderController