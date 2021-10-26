const express = require('express')
const router = express.Router()
const User = require('../models/user')

//MID global - mostrar user logado
//restrito ou nao 
router.use((req, res, next)=>{
  if('user' in req.session){
      res.locals.user = req.session.user
      res.locals.role = req.session.role
  }
  next()
})

router.get('/change-role/:role', (req, res)=>{
  //verifica se usuario está logado
  if('user' in req.session){
      //verifica se usuário possui role
      if (req.session.user.roles.indexOf(req.params.role) >=0 ){
        //mudo a sessão 
          req.session.role = req.params.role
      }
    }
  res.redirect('/')
})



router.get('/login', (req, res)=>{
    res.render('login')
})

router.get('/logout', (req, res)=>{
 req.session.destroy(()=>{
  res.redirect('/')
 })
})

router.post('/login', async (req, res)=>{
   const user = await User.findOne({ username: req.body.username })
   if(user){
      //checando se a senha bate
      const isValid = await user.checkPassword(req.body.password)
      if(isValid){
        //criando variável sessão
        req.session.user = user 
        //sesão para verificar papel ativo
        req.session.role = user.roles[0]
        //página restrita
        res.redirect('/restrito/noticias')
      }else{
          res.redirect('/login')
      }
  }else{
    res.redirect('/login')
  }
})

module.exports = router