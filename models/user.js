const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

//SCHEMA 
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        enum: ['restrito', 'admin']
    }
})

//antes de salvar senha
//nao pode ser arrow function pq precisa acessar contexto que é o proprio user do schema
UserSchema.pre('save', function(next){  
    const user = this 
    //se senha não altera
    if(!user.isModified('password')){
        //continua
        return next()
    }
//CRIANDO HASH SENHA
//criando salt random
    bcrypt.genSalt((err, salt) => {
        //adicionando salt ao hash e conversão do user.password
        bcrypt.hash(user.password, salt, (err,  hash)=>{
            //senha hasheada
            user.password = hash
            //passar para frente ou outro middleware
            next()
        })
    })
})

//VERIFICAR SENHA
//this faz referencia a função que recebe password não à arrow function
//Adicionando novos métodos ao schema User 
UserSchema.methods.checkPassword = function(password){
    return new Promise((resolve, reject)=>{
        //compara senha passada, com senha comparada do próprio objeto utilizado = this.password
        //Retonar true or false 
        bcrypt.compare(password, this.password, (err, isMatch)=>{
            if(err){
                reject(err)
            }else{
                resolve(isMatch)
            }
        })
    })
}


//Registrar schema no mongoose
const User = mongoose.model('User', UserSchema)
module.exports = User 