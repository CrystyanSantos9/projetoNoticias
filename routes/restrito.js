const express = require('express')
const Noticia = require('../models/noticia')
const router = express.Router()
const modelNoticia = require('../models/noticia')


//Checa se usuário está logado
//tiro a url porque tudo o que for restrito vai passar por esse middleware 
router.use( (req, res, next)=>{
    if(req.isAuthenticated()){
        if(req.user.roles.indexOf('restrito') >=0){
            return next()
        }else{
            res.redirect('/')
        }
         
    }
    res.redirect('/login')
 })

router.get('/', (req, res)=> {
    res.send('restrito')
})



//Carrega noticias restritas 
router.get('/noticias', async (req, res)=>{
    const noticias = await Noticia.find({ category: 'private'})
    res.render('noticias/restrito', {noticias})
})



module.exports = router