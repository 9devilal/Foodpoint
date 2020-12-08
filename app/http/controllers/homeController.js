const Menu = require('../../models/menu')

const homeController = ()=>{

    return {
        async index  (req , res){

           const items = await Menu.find()
           return res.render("home" , {items : items})
            
        }
    }

}

module.exports=homeController ;