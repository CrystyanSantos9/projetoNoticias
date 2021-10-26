const bcrypt = require('bcrypt')

bcrypt.genSalt().then(salt=>{
    bcrypt.hash('senha', salt).then(hash=>console.log(hash))
})

try{
    const a = Number(1)/Number(0);
    console.log(a)
}catch(e){
    console.log(e)
}

