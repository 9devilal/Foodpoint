const Order = require('../../../models/order')
const statusController = ()=>{
 
    return {
             
        update(req , res ){
            
            Order.updateOne({_id:req.body.orderId} ,{status : req.body.status},(err ,result)=>
            {  
                console.log('reached here\n') 
                if(err){
                     
                    return res.redirect('/worker/orders')

                }
                 //Emit socket events 
                 const eventEmitter =req.app.get('eventEmitter')
                 eventEmitter.emit('orderUpdated' , { id : req.body.orderId ,status:req.body.status})

               return  res.redirect('/worker/orders')
            })

        }
    }

}
module.exports = statusController