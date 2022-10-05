require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const dns = require("node:dns");
const ur = require("url-parse");
const saved = [];
const { table } = require("console");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
	res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
	res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", express.urlencoded({ extended: true }), (req, res) => {
	const l = ur(req.body.url);
	dns.lookup(l.hostname, (e, add) => {
		if (e) return res.json({ error: "Invalid URL" });
		saved.push(req.body.url);
		return res.json({ original_url: req.body.url, short_url: saved.length - 1 });
	});
});

app.get("/api/shorturl/:id", (req, res) => {
	const id = Number(req.params.id);
	console.log(saved);
	let r = saved[id];
	if (!r) return res.json({ error: "No short URL found for the given input" });
	res.redirect(saved[id]);
});

app.listen(port, function () {
	console.log(`Listening on port ${port}`);
});
