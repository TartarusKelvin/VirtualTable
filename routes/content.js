const express = require("express");
const router = express.Router();
const passwordHash = require("password-hash");
const marked = require("marked");

const User = require('../models/user')

const SourceBook = require("../models/SourceBook")
const Spell = require("../models/DND5e/spell")

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
    try{
        const newbook = await book.save()
        res.redirect("/content/sbook")
    }catch{
        res.redirect("/content/sbook")
    }
})

router.get("/spell",async(req,res)=>
{
    let searchOptions = {
        'components.V': req.query.Verbal !=null ? true:new RegExp("", "i"),
        'components.S': req.query.Somatic !=null ? true : new RegExp("", "i"),
        'components.M': req.query.Material !=null ?new RegExp("^(?!\s*$).+"):""
    };
    if(req.query.name != null && req.query.name !== "");{
        searchOptions.name = new RegExp(req.query.name, "i");
    }

    if(req.query.Somatic==null)
        delete searchOptions["components.S"];
    if(req.query.Verbal==null)
        delete searchOptions["components.V"];
    if(req.query.Material==null)
        delete searchOptions["components.M"];
    console.log(searchOptions)
    try{
        const spells = await Spell.find(searchOptions).populate("source_book").exec()
        spells.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
       res.render("edit/spell/spell",{spells:spells,searchOptions:req.query})
    }catch(error){
        res.render("edit/spell/spell", {spells:[],errorMessage:error.message,searchOptions:req.query})
    }
})

router.get("/spell/view/:id",async(req,res)=>
{
    try{
        const spell = await Spell.findById(req.params.id).populate("source_book").exec()
        if(spell.description != null)
            spell.description = marked(spell.description)
        if(spell.at_higher_level != null)
            spell.at_higher_level = marked(spell.at_higher_level)
        res.render("edit/spell/view",{spell:spell})
    }catch(err){
        console.error(err.message)
        const spells = await Spell.find().populate("source_book").exec()
        spells.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        res.render("edit/spell/spell",{errormessage:err.message,spells})
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
            V: (req.body.Verbal === null? false:true),
            S: (req.body.Somatic === null? false:true),
            M: (req.body.Material === null? " ":req.body.Material)
        },
        duration:{
            unit: req.body.durUnit,
            len: req.body.Duration,
            concentration: ((req.body.Concentration == null)? false:true),
        },
        cast_time:{
            unit: req.body.castUnit,
            len: req.body.cast_time,
            ritual: (req.body.ritual == null? false:true),
        },
        description:req.body.description,
        school:req.body.school,
        at_higher_level:req.body.Higher_Level
    })
    try{
        const newspell = await spell.save()
        res.redirect("/content/spell/new")
    }
    catch(err){
        let books = await SourceBook.find()
        books.sort((a,b) => (a.short_name > b.short_name) ? 1 : ((b.short_name > a.short_name) ? -1 : 0));
        res.render("edit/spell/new", {books:books,errormessage:err.message})
    }
})

router.get("/spell/edit/:id", async(req,res)=>{
    try{
    let spell = await Spell.findById(req.params.id)
    let books = await SourceBook.find()
    res.render("edit/spell/edit",{spell:spell, books:books})
    }catch(err){
        const spells = await Spell.find().populate("source_book").exec()
        spells.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        res.render("edit/spell/spell",{spells,errormessage:err.message})
    }
})

router.post("/spell/edit/:id", async(req,res)=>{
    try{
        let spell = await Spell.findById(req.params.id)
        spell.name= req.body.name
        spell.source_book= req.body.source
        spell.level= req.body.lvl
        spell.range= req.body.range
        spell.components.V= (req.body.Verbal == null? false:true)
        spell.components.S= (req.body.Somatic == null? false:true)
        spell.components.M= (req.body.Material == null? " ":req.body.Material)
        spell.durationunit= req.body.durUnit
        spell.durationlen= req.body.Duration
        spell.duration.concentration= ((req.body.Concentration == null)? false:true)
        spell.cast_time.unit= req.body.castUnit
        spell.cast_time.len= req.body.cast_time
        spell.cast_time.ritual= (req.body.ritual == null? false:true)
        spell.description=req.body.description
        spell.school=req.body.school
        spell.at_higher_level=req.body.Higher_Level
        spell.save()
        res.redirect("/content/spell/view/".concat(spell._id))
        console.log(req.body.Concentration)
    }catch(err){
        let spell = await Spell.findById(req.params.id)
        let books = await SourceBook.find()
        res.render("/edit/spell/edit",{spell,books,errormessage:err.message});
    }
})

router.post("/spell/delete", async(req,res)=>{
    console.log("DELETE")
    console.log("ID:",req.body.id)
    let spell = await Spell.findByIdAndDelete(req.body.id)
    res.redirect("/content/spell")
})

router.get("/spell/new",async(req,res)=>
{
    let books = await SourceBook.find()
    books.sort((a,b) => (a.short_name > b.short_name) ? 1 : ((b.short_name > a.short_name) ? -1 : 0));
    
    res.render("edit/spell/new", {books:books})
})

module.exports = router