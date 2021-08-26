const bcrypt = require('bcrypt')

password = bcrypt.hashSync('1234', 10)
console.log(password)

const same = bcrypt.compareSync('1234',password)

console.log(same)