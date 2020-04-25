if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const indexRouter = require("./routes/index");
const gameRouter = require("./routes/game");
const userRouter = require("./routes/user");
const contentRouter = require("./routes/content");
const playRouter = require("./routes/play");
const characterRouter = require("./routes/character");
const spellListRouter = require("./routes/spelllist");

//const Race= require("./models/race")

app.set("views", "./views");
app.set("view engine", "ejs");
app.set("layout", "layouts/layout");
app.use(express.static("public"));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(function (req, res, next) {
	try {
		res.locals.user_secret = req.cookies.user_secret;
		res.locals.user_name = req.cookies.user_name;
	} catch {
		res.locals.user_secret = "";
		res.locals.user_name = "null";
	}
	next();
});

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", (error) => {
	console.error(error);
});
db.once("open", (error) => {
	console.log("Connected To Mongoose");
});

app.use("/", indexRouter);
app.use("/game", gameRouter);
app.use("/user", userRouter);
app.use("/content", contentRouter);
app.use("/play", playRouter);
app.use("/character", characterRouter);
app.use("/spellList", spellListRouter);

app.listen(process.env.PORT || 3000);
