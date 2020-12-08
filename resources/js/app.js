import axios from 'axios'
import Noty from 'noty'
import moment from 'moment'
import { InitWorker } from './worker'
let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')
let guestCart = document.querySelectorAll('.add-to-guest')

let updateCart = (item)=>{
  
    axios.post('/update-cart' , item).then( res =>{
        console.log(res)
        cartCounter.innerText = res.data.totalQty
           console.log("reached addition\n")
        new Noty({
            type:"success",
            timeout:1000,
            text : 'Item added to cart',
            progressBar:false ,
        }).show()
    }).catch( err =>{

        new Noty({
            type:"error",
            timeout:1000,
            text : 'Something went wrong',
            progressBar:false ,
        }).show()

    })
}

// prevent user from adding items to cart when logged out
let abortCartAdd =()=>{
    new Noty({
        type:"warning",
        timeout:1000,
        text : 'Please logIn as Customer to add Items',
        progressBar:false ,
    }).show()
}

//Adding events 
addToCart.forEach( (btn) =>{
    // if(!user)return alert('login to add items')

btn.addEventListener('click' , (e)=>{
    //console.log(e)
    let item = JSON.parse(  btn.dataset.item )
  updateCart(item)  
})
    
})
// Event to stop adding to cart when logged out
guestCart.forEach((btn)=>{
    // console.log('guest cart pressed ')
    btn.addEventListener('click' ,(e)=>{
      
        abortCartAdd()
    })
})



//Change Order Status
let allStatus = document.querySelectorAll('.status_line')
let order = document.querySelector('#hiddenInput') ? document.querySelector('#hiddenInput').value :null ;
order = JSON.parse(order)

let time = document.createElement('small')

const updateStatus=(order)=>{

    allStatus.forEach((stat)=>{
        stat.classList.remove('done')
        stat.classList.remove('current')
    })
  
    let stepCompleted = true ;
    allStatus.forEach((currStatus)=>{
        if(currStatus.dataset.value === order.status){
            
            currStatus.classList.add('done')

            stepCompleted = false ;
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            currStatus.appendChild(time)
        }
        if(stepCompleted){

            currStatus.classList.add('current')
        }
        
       
    })
    //
}
updateStatus(order)

// Socket 
let socket = io()

if(order){

socket.emit('join' ,`order_${order._id}`)

}

let workerPath = window.location.pathname
// console.log('here it is \n' + workerPath)
if(workerPath.includes('worker')){
    InitWorker(socket)
    socket.emit('join' , 'workerRoom')
}


socket.on('orderUpdated' ,(data)=>{
  
    let updatedOrder = { ...order}
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    console.log( data)
    

    new Noty({
        type:"success",
        timeout:1000,
        text : 'Order Updated',
        progressBar:false ,
    }).show()

})
