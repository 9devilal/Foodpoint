const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customer/cartController')
const orderController = require('../app/http/controllers/customer/orderController')
const WorkerorderController = require('../app/http/controllers/worker/orderController')
const guest = require('../app/http/middlewares/guest')
const auth = require('../app/http/middlewares/auth');
const workerAuth = require('../app/http/middlewares/workerAuth');
const statusController = require('../app/http/controllers/worker/statusController');
const initRoutes=(app)=>{
    //homepage route
    app.get('/',homeController().index)
    //login route
    app.get('/login' ,guest ,authController().login)
    app.post('/login' ,authController().postlogin)
    // signup route
    app.get('/register',guest ,authController().register)
    app.post('/register' ,authController().postRegister)
    //logout route
    app.post('/logout',authController().logout)
     // cart Routes
    app.get('/cart' ,auth ,cartController().index)
    app.post('/update-cart' ,auth, cartController().update)
    //customer routes
    app.post('/orders',auth,orderController().store)
    app.get('/customer/orders',auth ,orderController().index)
    app.get('/customer/orders/:id',auth, orderController().show)
    //worker or admin routes
    app.get('/worker/orders' , workerAuth ,WorkerorderController().index)
    app.post('/worker/order/status' , workerAuth ,statusController().update)


}

module.exports =initRoutes