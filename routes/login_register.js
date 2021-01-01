let express = require('express')
let path = require("path");
let mysql = require('mysql')
let router = express.Router()
let crypto = require('crypto')
 

let connection = mysql.createConnection({
    host:'localhost',
    port:'3306',
    user:'root',
    password:'cclin890511',
    database:'login_register'
})
connection.connect()


/**
 * default route
 */
router.get('/',function(req,res){
    res.sendFile(path.join(__dirname,"../public/htmls/login.html"))
    //_dirname:当前文件的路径，path.join():合并路径
})


/**
 * generate salt
 * @param length: length of salt
 */
let getSalt = (length) => {
    return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0, length)
}


/**
 * hash password and salt with algorithm sha512
 * @param password: given password
 * @param salt: given salt
 */
let sha512 = (password, salt) => {
    let hash = crypto.createHmac('sha512', salt) // hashing by sha512
    hash.update(password)
    let value = hash.digest('hex').slice(0, 20)
    return {
        salt: salt,
        passwordHash: value,
    }
}


/**
 * return hashed password for storage
 * @param password: user password
 */
let saltHashPassword = (password) => {
    let salt = getSalt(16)
    let saltPwdData = sha512(password, salt)
    return saltPwdData
}


/**
 * decode hash with algorithm sha512
 */
let decodeHashSha512 = (password, username, salt) => {
    let querypasswordhash = "select password from user where username='"+username+"'"
    return new Promise(function(resolve, reject) {
        connection.query(querypasswordhash, function(err, result) {
            if(err) {
                reject(err)
                // console.log("decodeHashSha512 error occured: ", result)
            }else {
                let dataString1 = JSON.stringify(result)
                let data1 = JSON.parse(dataString1)
                let passwordMysql = data1[0].password
                // console.log("用戶查找passwordHash:", passwordMysql)
                let sha512Data = sha512(password, salt)
                // console.log("sha512Data:", sha512Data)
                const res = sha512Data.passwordHash === passwordMysql
                resolve(res)
            }
        })
    })
}


/**
 * login authentification
 */
router.get('/login',function(req, res) {
    let name = req.query.username
    let pwd = req.query.password
    // console.log("name:", name)
    // console.log("password:", pwd)
    // let query = "select username, password from user where username='"+name+"' and password='"+pwd+"'"
    let query = "select username from user where username='"+name+"'"
    let querySalt = "select salt from user where username='"+name+"'"

    connection.query(query, function(err, result) {
        if(err) {
            console.log("login error 1 occured: ", result)
        }
        if(result.length == 0) {
            res.sendFile(path.join(__dirname,"../public/htmls/no-user.html"))
        }else {
            connection.query(querySalt, async(err, result) => {
                if(err) {
                    console.log("login error 2 occured: ", result)
                }else {
                    dataString = JSON.stringify(result)
                    data = JSON.parse(dataString)
                    // console.log("用戶查找salt:", data[0].salt)
                    if(await decodeHashSha512(pwd, name, data[0].salt)) {
                        // console.log("success")
                        res.sendFile(path.join(__dirname,"../public/htmls/mainpage.html"))
                    }else {
                        // console.log("fail")
                        res.sendFile(path.join(__dirname,"../public/htmls/pwdWrong.html"))
                    }
                }
            })
        }
    })
})


/**
 * register authentification
 */
router.get('/register',function(req, res) {
    let name = req.query.username

    let pwd = req.query.password
    let saltPwdData = saltHashPassword(pwd)
    // console.log(saltPwdData)
    let password = saltPwdData.passwordHash
    let salt = saltPwdData.salt
    // console.log(salt)

    let type = req.query.type
    let sex = req.query.userSex
    let birth = req.query.birth
    let email = req.query.email
    let user = [name, password, salt, type, sex, birth, email]
    let query = 'insert into user(username, password, salt, userType, userSex, birthdate, email) values(?,?,?,?,?,?,?)'

    connection.query(query, user, function(err, result) {
        if(err) {
            console.log("register error occured: ", result)
        }else {
            res.sendFile(path.join(__dirname,"../public/htmls/login.html"))
        }
    })
})

module.exports = router;
