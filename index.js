const express = require('express')
const app = express()

app.get('/',(req,res) => {
    res.send('Things appear to be working just fine here...');
})

app.get('/get-thumbnail/:img',(req,res) => {
    //we don't actually need this, we only need the link, which we will 
    //already know from the get-imgs route
    res.send(req.params.img);
})



const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Server Is Up!'))