const express = require('express')
const path = require('path')
const app = express()

app.get('/',(req,res) => {
    res.send('Things appear to be working just fine here...');
})

//need this so we can return the actual files when they are requested
app.get('/images/thumbnails/:img',(req,res) => {
    //should check if it exists, if not send an error
    res.sendFile(`${__dirname}/images/thumbnails/${req.params.img}.jpg`);
})
app.get('/images/fullsize/:img',(req,res) => {
    res.sendFile(`${__dirname}/images/fullsize/${req.params.img}.jpg`)
})



const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Server Is Up!'))