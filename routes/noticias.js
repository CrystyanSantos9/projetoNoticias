const express = require('express')
const router = express.Router()
const modelNoticia = require('../models/noticia')

router.get('/', async (req, res)=>{
    //para que usuario logada acesse tanto publica quanto privadas
    /*let conditions = {}
    //se usuario nao logado
    if(!('user' in req.session)){
        //restringe busca no model noticias
        conditions = {category:'public'}
    }*/
    const conditions = { category: 'public' }
    //pega todas as notícias - somente publicas
    const noticias = await modelNoticia.find(conditions)
    res.render('noticias/index', { noticias })
})

module.exports = router