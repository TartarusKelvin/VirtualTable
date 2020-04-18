const express = require("express")
const router = express.Router()

router.get('/', async (req,res)=>
{
    res.render("games/play/play", {})
})

module.exports = router