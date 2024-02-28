const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');
const insight = require('./models/url-shortner');
const path = require("path");
const { log } = require('console');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
// app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/url-shortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

// Handle POST requests to shorten URLs
app.post('/shorten', async (req, res) => {
    const { originalurl } = req.body;
    console.log(originalurl)
    const shorturl = shortid.generate();
    console.log(originalurl, shorturl);

    const newUrl = new insight({ originalurl, shorturl });
    await newUrl.save();

    const fullShortUrl = `${req.protocol}://${req.get('host')}/${shorturl}`;
    res.send(`<p>Shortened URL: <span id="shortUrlValue">${fullShortUrl}</span> <button id="copyButton" onclick="copyUrl()">Copy</button></p>`);
});


app.get('/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params; // Changed from shorturl to shortUrl
    console.log("Requested Short URL:", shortUrl); // Add this line for debugging

    try {
        const url = await insight.findOne({ shorturl: shortUrl }); // Changed from shorturl to shortUrl

        if (url) {
            console.log("Original URL Found:", url.originalurl); // Add this line for debugging
            res.redirect(url.originalurl);
        } else {
            console.log("Short URL Not Found in Database"); // Add this line for debugging
            res.status(404).json({ error: 'URL not found' });
        }
    } catch (error) {
        console.error("Error retrieving URL from database:", error); // Add this line for debugging
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
