const express = require('express')
const app = express()
const https = require('https');
const http = require('http');
var fs = require('fs');
const port = process.env.PORT || 3355
const path =require('path')
const session = require('express-session')
const User = require('./models/user')
const Noticia = require('./models/noticia')
const mongoose = require('mongoose')
//definindo promise global de uso do mongose
mongoose.Promise = global.Promise

// serve the API on 80 (HTTP) port
const httpServer = http.createServer(app);

// serve the API with signed certificate on 443 (SSL/HTTPS) port
const httpsServer = https.createServer({
    //dinarname vai até = /home/vagrant/github/noticias/
    //os outros params são a pasta onde está o arquivo e o arquivo 
    key: fs.readFileSync(path.join(__dirname, 'configs/certs', 'privatekey.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'configs/certs', 'certificate.pem')),
  }, app);

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


//ROUTES
const routesAuth = require('./routes/auth')
const routesNoticias = require('./routes/noticias')
const routesRestrito = require('./routes/restrito')
const routesMainPage = require('./routes/pages')
const routesAdmin = require('./routes/admin');
const { join } = require('path');


app.use('/', routesAuth)
app.use('/', routesMainPage)
app.use('/restrito', routesRestrito)
app.use('/noticias', routesNoticias)
app.use('/admin', routesAdmin)



//Cria usuario inicial
const createInitialUser = async (UserModal) =>{
    //verifica se usuario admin já existe no sistema
    const total = await UserModal.countDocuments({}) //{ username: 'Crystyan'}
    //cria admin
   if(total === 0){
    const user = new UserModal({
        username: 'user1',
        password: 'senha',
        roles: ['restrito','admin']
    })
    await user.save(()=> console.log("User admin created ..."))

    const user2 = new UserModal({
        username: 'user2',
        password: 'senha',
        roles: ['restrito']
    })
    await user2.save(()=> console.log("Regular user created ..."))

    }else{
        console.log('user created skipped')
    }

    //Criando noticias com a inicialização da aplicação
    // const noticiaPublic = new Noticia({
    //     title: 'Notícia Pública' + new Date().getTime(),
    //     content: 'Informação iniciada com a primeira inicialização da aplicação',
    //     category: 'public'
    // })
    // await noticiaPublic.save()

    // const noticiaPrivate = new Noticia({
    //     title: 'Notícia Privada' + new Date().getTime(),
    //     content: 'Informação iniciada com a primeira inicialização da aplicação',
    //     category: 'private'
    // })
    // await noticiaPrivate.save()

}

//Conectando mongoose 
mongoose
    .connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{
        //cria usuario inicial
        createInitialUser(User)
    //Start servidor 
    // app.listen(port, ()=> console.log('Listening...'))

    httpServer.listen(80, () => {
        console.log('HTTP Server running on port 80');
    });

    httpsServer.listen(443, () => {
        console.log('HTTPS Server running on port 443');
    });

    }).catch(e => console.log(e))





 


