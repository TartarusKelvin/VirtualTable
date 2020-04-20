const express = require("express")
const router = express.Router()
const passwordHash = require('password-hash');
const multer = require("multer")
const path = require("path")
const Game = require('../models/game')
const uploadPath = path.join('public',Game.coverImageBasePath)
const User = require('../models/user')
const imageMimeTypes = ['image/jpeg','image/png','image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) =>{
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})


// All Games
router.get('/', async (req,res)=>
{
    let searchOptions = {}
    if(req.query.name != null && req.query.name !== "")
    {
        searchOptions.name = new RegExp(req.query.name, "i")
    }
    try{
        let games = await Game.find(searchOptions).populate("gm").exec()
        res.render("games/index", {games:games, searchOptions:req.query})
    }catch{
        res.render("games/index", {games:[], searchOptions:req.query})
    }
})

router.get('/view/:gameid', async (req,res)=>
{
    let searchOptions = {};
    if(req.query.name != null && req.query.name !== "")
        searchOptions._id = req.params.gameid;
    try{
        let games = await Game.findById(req.params.gameid).populate("gm").populate("players").exec();
        res.render("games/viewgame", {game:games,canplay:games.players.some(e => e.secret === req.cookies.user_secret)});
    }catch{
        res.render("games/index", {games:[], searchOptions:req.query});
    }
})

router.post('/join/:gameid', async (req,res)=>
{
    try{
        let games = await Game.findById(req.params.gameid).populate("gm").exec()
        let user = await User.find({secret:req.cookies.user_secret})
        if(!games.players.includes(user[0]._id) && passwordHash.verify(req.body.pass,games.pass))
        {
            games.players.push(user[0]._id)
            await games.save()
        }
        res.redirect("/game/view/".concat(games[0]._id))
    }catch{
        res.redirect("/game/")
    }
})

// New Game
router.get('/new',(req,res)=>
{
    if(req.cookies.user_secret !== null){
        res.render("games/new", {game: new Game()})
    }else{
        res.redirect("/user/login")
    }
})

//create Game Route
router.post("/", upload.single('cover') , async(req, res) =>{
    const filename = req.file !==null ? req.file.filename : null
    const users = await User.find({secret: req.cookies.user_secret})
    const game = new Game({
        name: req.body.name,
        pass: passwordHash.generate(req.body.pass),
        gm: users[0]._id,
        description: req.body.description,
        coverName: filename,
        players:[]
    })
    try{
        const newGame = await game.save()
        res.redirect("game")
    }catch{
        res.render("games/new",{
            game:game,
            errormessage:"Error Creating gmae"
        }) 
    }
})

module.exports = router