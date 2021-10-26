const User = require('./models/user')
const user = new User({
    username: 'Crystyan',
    password: 'senha',
})
user.save()