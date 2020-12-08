require('dotenv').config();
const express = require ('express') ; 
const path =require('path');
const ejs = require ('ejs') ;
const fs = require('fs')
const expresslayout = require ('express-ejs-layouts') ;
const app = express();
const PORT = process.env.PORT || 3090 ;
const router = require('./routes/web');
const mongoose = require('mongoose');
const session = require('express-session')
const flash = require('express-flash');
const { urlencoded } = require('express');
const MongoDbStore = require('connect-mongo')(session);
const passport = require('passport')
const Emitter = require('events')
//Database connection

const url = 'mongodb://localhost/Foodpoint';
mongoose.connect(url ,{useNewUrlParser : true ,useCreateIndex:true ,useUnifiedTopology:true ,useFindAndModify:true});

const connection = mongoose.connection ;
connection.once('open' , ()=>{
    console.log('Database connected.....');
}).catch(err =>{
    console.log('Connection failed')
});

// session store
let mongostore = new MongoDbStore({
    
    mongooseConnection : connection ,
    collection :'sessions'

})

//Even Emitter 
const eventEmitter = new Emitter() 
app.set('eventEmitter' , eventEmitter)

//Configuring session

app.use(session({
    secret :process.env.COOKIE_KEY ,
    resave : false ,
    store  :mongostore ,
    saveUninitialized : false ,
    cookie : {maxAge : 1000 * 48 * 60 * 60}//48 hours

}))

//passport config

const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


app.use(flash()) ;
// set ejs as template engine 
app.use(expresslayout);
app.set('views' ,path.join(__dirname , 'resources/views')) ;
app.set('view engine' , 'ejs');


//Serving  Static files
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//Global middleware

app.use((req , res ,next)=>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

//Routing 
router(app);

//listening on port 3300
const server = app.listen(PORT, () =>{
    
    console.log(`live on ${PORT}`);
})

//Socket for realtime update
const io = require('socket.io')(server)
io.on('connection' ,(socket)=>{
    socket.on('join' ,(roomName)=>{
        socket.join(roomName)

    } )
    //Join the client
})

eventEmitter.on('orderUpdated' , (data)=>{
      io.to(`order_${data.id}`).emit('orderUpdated' , data)
})
eventEmitter.on('orderPlaced' , (placedOrder)=>{
    io.to('workerRoom').emit('orderPlaced' , placedOrder)
})