const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Spell = require("../models/DND5e/spell");
const SpellList = require("../models/DND5e/spellList");

router.get("/", async (req, res) => {
	if (req.cookies.user_secret !== null) {
		const user = await User.findOne({ secret: req.cookies.user_secret });
		const spellLists = await SpellList.find({ creator: user._id });
		spellLists.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
		res.render("spelllist/index", { spellLists });
	}
});

router.get("/new", async (req, res) => {
	try {
		var spells = await Spell.find();
		res.render("spelllist/new", { spells });
	} catch (err) {
		res, render("spelllist/new", { spells: [], errormessage: err.message });
	}
});

router.post("/new", async (req, res) => {
	try {
		const user = await User.findOne({ secret: req.cookies.user_secret });
		const spellList = new SpellList({
			name: req.body.name,
			spells: req.body.spell,
			creator: user._id,
		});
		const newSpellList = await spellList.save();
		res.redirect("/spelllist/");
	} catch (err) {
		throw err;
		res.redirect("/spelllist/new");
	}
});

router.get("/edit/:id", async (req, res) => {
	try {
		var spells = await Spell.find();
		var spellList = await SpellList.findById(req.params.id);
		res.render("spelllist/edit", { spells, spellList });
	} catch (err) {
		res, render("spelllist/edit", { spells: [], errormessage: err.message });
	}
});

router.post("/edit/:id", async (req, res) => {
	try {
		var spellList = await SpellList.findById(req.params.id);
		spellList.spells = req.body.spell;
		await spellList.save()
		res.redirect("/spelllist/view/".concat(spellList._id));
	} catch (err) {
		res.redirect("/spelllist/view/".concat(spellList._id));
	}
});

router.get("/view/:id", async (req, res) => {
	try {
		const spellList = await SpellList.findById(req.params.id).populate("spells");
		let spells = spellList.spells;
		if (req.query.Concentration != 0) {
			spells = spells.filter((spell) => (spell.duration.concentration == (req.query.Concentration == 1) ? true : false));
		}
		if (req.query.Material != 0) {
			if (req.query.Material == 1) spells = spells.filter((spell) => spell.components.M.length > 0);
			else spells = spells.filter((spell) => spell.components.M.length == 0);
		}
		res.render("spelllist/view", { spellList, spells, query: req.query });
	} catch (err) {
		res.render("spelllist/view", { spellList: [], spells: [], query: req.query });
		throw err;
	}
});

module.exports = router;
