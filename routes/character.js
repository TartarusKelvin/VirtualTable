const express = require("express")
const router = express.Router()
const passwordHash = require('password-hash');
const FateCoreCharacter = require('../models/user')

// All Users
router.get('/', async (req,res)=>
{
    res.render("character/index")
})

// New User
router.get('/new',(req,res)=>
{
    res.render("character/FATE-CORE/new", {})
})


router.get('/login',(req,res)=>
{
    res.render("user/login", {})
})

//create User Route
router.post("/new", async(req, res) =>{

})


module.exports = router