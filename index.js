const express = require('express')
const app = express()
const port = process.env.PORT || 3355
const path =require('path')
const session = require('express-session')
const User = require('./models/user')
const Noticia = require('./models/noticia')
const mongoose = require('mongoose')
//definindo promise global de uso do mongose
mongoose.Promise = global.Promise

//Conexao mongo - escolha driver de conexao
const mongo = process.env.MONGODB || 'mongodb://localhost/noticias'



//Templates 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//Sessions
app.use(session( { secret : 'senha' })) //secret - para midleware
//parse body 
// app.use(express.json())
app.use(express.urlencoded({ extended: true}))
//Static Files
app.use(express.static('public'))

//MID global - mostrar user logado
//restrito ou nao 
app.use((req, res, next)=>{
    if('user' in req.session){
        res.locals.user = req.session.user
    }
    next()
})
//ROUTES
const routesAuth = require('./routes/auth')
const routesNoticias = require('./routes/noticias')
const routesRestrito = require('./routes/restrito')
const routesMainPage = require('./routes/pages')

//mid auth 
app.use('/restrito', (req, res, next)=>{
   if('user' in req.session){
        return next()
   }
   res.redirect('/login')
})


app.use('/restrito', routesRestrito)
app.use('/noticias', routesNoticias)
app.use('/', routesAuth)
app.use('/', routesMainPage)

//Cria usuario inicial
const createInitialUser = async (UserModal) =>{
    //verifica se usuario admin já existe no sistema
    const total = await UserModal.countDocuments( { username: 'Crystyan'})
    //cria admin
   if(total === 0){
    const user = new UserModal({
        username: 'Crystyan',
        password: 'senha',
    })
    await user.save(()=> console.log("User admin created ..."))
    }else{
        console.log('user created skipped')
    }

    //Criando noticias com a inicialização da aplicação
    const noticiaPublic = new Noticia({
        title: 'Notícia Pública' + new Date().getTime(),
        content: 'Informação iniciada com a primeira inicialização da aplicação',
        category: 'public'
    })
    await noticiaPublic.save()

    const noticiaPrivate = new Noticia({
        title: 'Notícia Privada' + new Date().getTime(),
        content: 'Informação iniciada com a primeira inicialização da aplicação',
        category: 'private'
    })
    await noticiaPrivate.save()

}

//Conectando mongoose 
mongoose
    .connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{
        //cria usuario inicial
        createInitialUser(User)
    //Start servidor 
    app.listen(port, ()=> console.log('Listening...'))
    }).catch(e => console.log(e))





 

