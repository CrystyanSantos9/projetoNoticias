const express = require('express')
const Noticia = require('../models/noticia')
const router = express.Router()
const modelNoticia = require('../models/noticia')


router.get('/', (req, res)=> {
    res.send('restrito')
})



//noticias restritas 
router.get('/noticias', async (req, res)=>{
    const noticias = await Noticia.find({ category: 'private'})
    res.render('noticias/restrito', {noticias})
})



module.exports = router