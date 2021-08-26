const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')
var session = require('express-session')

const apiRouter = require('./routes/router')
app.set('views' , path.resolve(__dirname+'/views'))
app.set('view engine' , 'ejs')
app.engine('html', require('ejs').renderFile)


app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use(session({
    secret: 'my key',                           //아니면 미리 만들어 놓을꺼냐 등에 대한 옵션들임
    resave: true,
    saveUninitialized:true
}));

app.use('/', apiRouter)

var port = 8080
app.listen(port , ()=>{
    
    console.log(`Server is Runing at http://localhost:${port}`)
})