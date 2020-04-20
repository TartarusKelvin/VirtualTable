const express = require("express")
const router = express.Router()
const passwordHash = require('password-hash');
const User = require('../models/user')

function saveUserInfo(secret, username, remember=false){
    if(remember){
        res.cookie("user_secret",secret,
            {expires: new Date(Date.now() + 900000)})
        res.cookie("user_name",username,
            {expires: new Date(Date.now() + 900000)})
    }else{
        res.cookie("user_secret",secret)
        res.cookie("user_name",username)
    }
}

// All Users
router.get('/', async (req,res)=>
{
    res.send(getUserName(req.query.secret))
})

// New User
router.get('/new',(req,res)=>
{
    res.render("user/new", {})
})


router.get('/login',(req,res)=>
{
    res.render("user/login", {})
})

router.post("/login", async (req,res)=>
{
    try{
        let searchOptions = {
            name:req.body.name
        }
        users = await User.find(searchOptions)
        user = users[0]
        if(passwordHash.verify(req.body.pass, user.pass))
        {
            saveUserInfo(user.secret,user.name,req.body.remember)
        }else{
            throw "FAILED COMPARIOSN";
        }
        res.redirect("/")
    }
    catch{
        res.render("user/login",{
            errormessage:"Error: Incorrect Username and or password"
       })
    }

})

//create User Route
router.post("/new", async(req, res) =>{
    const user = new User({
        name: req.body.name,
        pass: passwordHash.generate(req.body.pass),
        secret: passwordHash.generate(req.body.name.concat(req.body.pass))
    })
    try{
        let searchOptions = {
            name: req.body.name
        }
        users_with_same_name = await User.find(searchOptions)
        if(users_with_same_name.length === 0){
            const newUser = await user.save()
            saveUserInfo(user.secret,user.name,req.body.remember)
            res.redirect("/")
        } else{
            res.render("user/new",{
                user:user,
                errormessage:"A User With That Name Already Exists"
            })
        }
    } 
    catch {
        res.render("user/new",{
            user:user,
            errormessage:"Error Creating User"
       })
    }
})

router.get('/logout', async (req,res)=>
{
    res.clearCookie("user_secret")
    res.clearCookie("user_name")
    res.redirect('/')

})

async function getUserName(secret){
    const user = await User.find({secret:secret})
    console.log(user)
    if(user.length !== 0)
        return user[0]
    return null
}

module.exports = router