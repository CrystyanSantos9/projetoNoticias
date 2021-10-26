const express = require('express')
const router = express.Router()
const User = require('../models/user')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

//inicializando o passport
router.use(passport.initialize())
//falar para ele usar sessão
router.use(passport.session())

//forma de serializar autenticacao
passport.serializeUser((user, done)=>{
  done(null, user)
})

passport.deserializeUser((user, done)=>{
  done(null, user)
})

//configurando passport
passport.use(new LocalStrategy(async (username, password, done)=>{
  //procura por username
  const user = await User.findOne({ username })
  if(user){
    const isValid = await user.checkPassword(password)
    if(isValid){
      return done(null, user) //calback retornado
    }else{
      return done(null, false)
    }
    //se nao user
  }else{
    return done(null, false)
  }
}))

//MID global - mostrar se user logado
//restrito ou nao 
router.use((req, res, next)=>{
  if(req.isAuthenticated()){
      res.locals.user = req.user
      //como nao setamos sessão - é necessario setar role antes
      if(!req.session.role){
          req.session.role = req.user.roles[0]
      }
      res.locals.role = req.session.role
  }
  next()
})


//Troca de papesi - menu suspenso
router.get('/change-role/:role', (req, res)=>{
  //verifica se usuario está logado
  if(req.isAuthenticated()){
      //verifica se usuário possui role
      if (req.user.roles.indexOf(req.params.role) >=0 ){
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

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: false
}))
module.exports = router