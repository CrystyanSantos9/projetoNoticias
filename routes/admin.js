const express = require('express')
const Noticia = require('../models/noticia')
const router = express.Router()

//Checa se usuário está logado
//tiro a url porque tudo o que for restrito vai passar por esse middleware 
router.use((req, res, next)=>{
    if('user' in req.session){
        //verifica se é admdin ['roles']
        if(req.session.user.roles.indexOf('admin') >=0 ){
            return next()
        }else{
            res.redirect('/')
        }      
    }else{
        res.redirect('/login')
    }
   
 })

router.get('/', (req, res)=> {
    res.send('admin')
})


//pode retornar todas as notícias
router.get('/noticias', async (req, res)=>{
    const noticias = await Noticia.find({})
    res.render('noticias/admin', { noticias })
})


module.exports = router