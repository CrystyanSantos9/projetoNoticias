const express = require('express')
const router = express.Router()
const User = require('../models/user')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy

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

//configurando passport - Estratégia Local
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

// //configurando passport - Estratégia Facebook
passport.use(new FacebookStrategy({
  clientID: '928733271375063',
  clientSecret: '12a2569b5a92227a522c260f5d49bfd5',
  callbackURL: 'https://192.168.1.103/facebook/callback',
  profileFields: ['id', 'email', 'photos', 'displayName']
}, async( accessToken, refreshToken, profile, done) =>{
  const userDB = await User.findOne({ facebookId: profile.id })
  if (!userDB) {
    // console.log(profile)
    const user = new User({
      name: profile.displayName,
      facebookId: profile.id,
      roles: ['restrito']
    })
    await user.save()
    done(null, user)
  }else{
    done(null, userDB)
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

router.get('/logout', function(req, res){
  req.session.destroy(() => {
    req.logout()
    res.redirect('/')
  })
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: false
}))

router.get('/facebook', passport.authenticate('facebook'))
router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/')
  }
)

// router.get('/facebook', passport.authenticate('facebook'))
// //tela intermeridária do facebook - redireciona para callback 
// router.get('/facebook/callback', 
// //passando por tela de transição do facebook - se der falha manda pro barra
//                 passport.authenticate('facebook', { failureRedirect: '/' }),
//                 (req, res)=>{
//                   //logou com sucesso
//                   req.redirect('/')
//                 }
// )
module.exports = router