const mongoose = require("mongoose");

const spellListSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	spells: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "DND5e-Spell",
			required: true,
		},
	],
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

module.exports = mongoose.model("DND5e-SpellList", spellListSchema);
