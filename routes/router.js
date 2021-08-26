var route  = require('express').Router()
var mysql = require('mysql');
const bcrypt = require('bcrypt')

const accessKeyId = "kas api 에서 생성한 accessKeyId ";
const secretAccessKey = "kas api 에서 생성한 secretAccessKey";

const chainId = 1001 // 클레이튼 테스트 네트워크 접속 ID 

caver.initKASAPI(chainId, accessKeyId, secretAccessKey) //KAS console 초기화

const keyringContainer = new caver.keyringContainer()
const keyring = keyringContainer.keyring.createFromPrivateKey('your wallet privatekey')
keyringContainer.add(keyring) 


// kip7.setWallet(keyringContainer)//kip7 내의 wallet 설정
async function create_wallet(){     //wallet 생성 function
    const wallet = await caver.kas.wallet.createAccount()   //wallet 생성
    // console.log(wallet);
    return wallet.address
}


async function token_trans(_address, _amount){       //token 송금 function   //생성된 토큰의 Address 입력
    const kip7 = new caver.kct.kip7('creat_token() 실행시 생성되 주소') 
    kip7.setWallet(keyringContainer)//kip7 내의 wallet 설정
    const receipt = await kip7.transfer(_address, _amount, { from: keyring.address })       //transfer('토큰 받는 주소', 토큰 양, {from:'트랜젝션을 일으키는 주소'})
    console.log(receipt);
}

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '1234',
    port:3307,
    database : 'debt' 
  });





route.get('/register', (req, res)=>{
    res.render('register.html')
})

route.post('/register' , (req, res)=>{
    var username = req.body.username
    var email = req.body.email
    var password  = bcrypt.hashSync(req.body.password ,10)
    var address = req.body.address
    console.log(password)

    connection.query(`SELECT email FROM users WHERE email = '${email}'` , (err, result)=>{
        console.log(result)
        if (result.length == 0) {
           c
            connection.query(`INSERT INTO users (username, email, password ,address) VALUES ('${username}', '${email}', '${password}','${address}');`, (error, results) =>{
                if (error) {
                    console.log(error);
                }
                console.log(results);
            });
              
            connection.end();
      
    
        // console.log("NOTHING")
           
        } else {
            console.log("중복된 이메일입니다.")
        }
   })
    res.send(username)
})

route.get('/login', (req, res)=>{
    res.render('login.html')
})

route.post('/login' , (req, res)=>{
    var email = req.body.email
    var password = req.body.password
    var sql = `SELECT * FROM users WHERE email='${email}'`
    connection.query(sql, (err, result)=>{
        if (err){
            console.log(err)
        } else {
            if (result.length ==0){
                console.log("USER IS NOT EXIST")
                res.send("USER IS NOT EXIST")
            } else {
                sqlPassword = result[0].password
                var pwResult = bcrypt.compareSync(password,sqlPassword )
                if (pwResult == true) {
                    req.session.user = {
                        username:result[0].username,
                        address:result[0].address,
                        email:result[0].email
                    }

                    console.log(req.session.user)
                    res.send(`${req.session.user.username}님 반갑습니다. 당신의 주소는 ${req.session.user.address}`)
                } else {
                    res.send("passWord is invaild")
                }
            }
        }
    })
})


//admin의 address는 klaytn wallet 생성시 주소
function isAdmined(req ,res ,next){
    if (req.session.user == undefined) {
        res.redirect('/login')
    } else {
        if (req.session.user.email =='2@naver.com') next()
        else res.redirect('/login')
    }
    
}  

function isLogined(req, res , next) {
    if (req.session.user == undefined) res.redirect('/login')
    else next()
}

route.get('/manage' ,isAdmined,  (req, res)=>{
    sql = `SELECT * FROM debt`
    connection.query(sql, (err , result)=>{
        if (err) console.error(err)
        else {
            console.log(result)
            res.render('manage.html' , {data : result})
        }
    })
})


route.get('/requestcoin' ,isLogined ,(req, res)=>{
    // console.log(req.session.user)
    
    res.render('requestcoin.html', {user:req.session.user})
})

route.post('/requestcoin/:address' ,isLogined, (req, res)=>{
    var coin  = req.body.coin
    console.log(req.params.adress)
    sql = `INSERT INTO debt (name , amount , bsign ,address) VALUES ('${req.session.user.username}', '${coin}', 1 ,'${req.params.address}')`
    connection.query(sql, (err, result)=>{
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

route.post('/accept/:address/:ids/:amount', isAdmined , (req, res)=>{
    var asign = req.body.asign
    var address = req.params.address
    console.log(address)
    var sql_1 = `SELECT * FROM users WHERE address='${address}'`
    connection.query(sql_1,(err, result)=>{
        var id = req.params.ids
        var amount = req.params.amount
        console.log(result)
        var sql = `UPDATE debt SET asign = ${parseInt(asign)} WHERE (id = ${id});`
        connection.query(sql, (err, data)=>{
            console.log(address)
            token_trans(address, amount).then(
                sendResult=>{
                    console.log(sendResult)
                    res.send("SUCCESS")
                }
            )
        })
    })
})

module.exports = route;