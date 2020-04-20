const express = require("express")
const router = express.Router()
const passwordHash = require('password-hash');

const User = require('../models/user')

const SourceBook = require("../models/SourceBook")
const Spell = require("../models/spell")

// New User
router.get('/sbook',async (req,res)=>
{
    try{
        let books = await SourceBook.find()
        books.sort((a,b) => (a.short_name > b.short_name) ? 1 : ((b.short_name > a.short_name) ? -1 : 0));
        res.render("edit/sbook", {books:books})
    }catch{
        res.render("edit/sbook", {books:[]})
    }
})

router.get('/sbook/peek/:id',async (req,res)=>
{
    try{
        let books = await SourceBook.findById(req.params.id)
        res.send(books)
       // res.send("{name:".concat(books.name).concat(",short_name:".concat(books.short_name).concat("}")))
    }catch{
        res.send("{}")
        //res.render("edit/sbook", {books:[]})
    }
})

router.post("/sbook/edit",async(req,res)=>{
    if(req.body.name === "" && req.body.code ==="") //delete
    {
        //Delete
        try{
            const book = await SourceBook.findByIdAndDelete(req.body.toedit)
            book.save()
        }
        catch{}
    }
    else if(req.body.name === "" || req.body.code ==="")
    {

        //nothing
    }else{
        const book = await SourceBook.findById(req.body.toedit)
        book.name = req.body.name
        book.short_name = req.body.code
        await book.save()
        //update
    }
    res.redirect("/content/sbook")
})

router.post("/sbook",async (req,res)=>
{
    const book = new SourceBook({
        name: req.body.name,
        short_name: req.body.code
    })
    console.log(req.body.name)
    console.log(book)
    try{
        const newbook = await book.save()
        res.redirect("/content/sbook")
    }catch{
        res.redirect("/content/sbook")
    }
})

router.get("/spell",async(req,res)=>
{
    try{
        const spells = await Spell.find().populate("source_book").exec()
        spells.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        res.render("edit/spell/spell",{spells:spells})
    }catch{
        res.render("edit/spell/spell", {})
    }
})

router.get("/spell/view/:id",async(req,res)=>
{
    try{
        const spell = await Spell.findById(req.params.id).populate("source_book").exec()
        res.render("edit/spell/view",{spell:spell})
    }catch{
        res.redirect("/content/spell")
    }
})

router.post("/spell",async(req,res)=>
{
    const spell = new Spell({
        name: req.body.name,
        source_book: req.body.source,
        level: req.body.lvl,
        range: req.body.range,
        components:
        {
            V: (req.body.Verbal == null? false:true),
            S: (req.body.Somatic == null? false:true),
            M: (req.body.Material == null? " ":req.body.Material)
        },
        duration:{
            unit: req.body.durUnit,
            len: req.body.Duration,
            concentration: (req.body.Concentration == null? false:true),
        },
        cast_time:{
            unit: req.body.castUnit,
            len: req.body.cast_time,
            ritual: (req.body.ritual == null? false:true),
        },
        description:req.body.description,
        school:req.body.school,
        at_higer_level:req.body.Higher_Level
    })
    console.log(spell.components.V)
    const newspell = await spell.save()
    try{
        const newspell = await spell.save()
    }
    catch{}
    res.redirect("/content/spell/new")
})
router.get("/spell/new",async(req,res)=>
{
    let books = await SourceBook.find()
    books.sort((a,b) => (a.short_name > b.short_name) ? 1 : ((b.short_name > a.short_name) ? -1 : 0));
    
    res.render("edit/spell/new", {books:books})
})

module.exports = router