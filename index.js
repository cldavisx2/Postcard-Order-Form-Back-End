const express = require('express');
const path = require('path');
const db = require('./db');
const cors = require('cors');
const excel = require('excel4node');
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json()
const app = express();
app.use(cors({
    origin: '*'
}));


app.get('/',(req,res) => {
    res.send('Things appear to be working just fine here...');
})

//get a list of all the images from mongo and send it to the frontend
app.get('/get-images',(req,res) => {
    const collection = 'Images';
    db.getDB().collection(collection).find({},{projection:{_id:0}}).toArray((err,data) => {
        res.send(data)
    })
})

//get all the tags so we dont have to do it on the frontend
app.get('/get-tags',(req,res) => {
    const collection = 'Images';
    db.getDB().collection(collection).find({},{projection:{_id:0,name:0}}).toArray((err,data) => {
        //res is an array of objects each with only a tag key and an array of tags as it's value
        //go through each of the tag arrays, check if we currently have the tag, if not add it
        let tags = [];
        data.forEach(cur => {
            cur.tags.forEach(t => {
                if(!tags.includes(t)){
                    tags.push(t)
                }
            })
        });
        res.send(tags)
    })
})

//Return the thumbnails when they are requested
app.get('/images/thumbnails/:img',(req,res) => {
    //should check if it exists, if not send an error
    res.sendFile(`${__dirname}/images/thumbnails/${req.params.img}.jpg`);
})

//return the fullsize images when they are requested
app.get('/images/fullsize/:img',(req,res) => {
    res.sendFile(`${__dirname}/images/fullsize/${req.params.img}.jpg`)
})

//Generates the XLS order Form
app.post('/get-xls',jsonParser,(req,res) => {
    //will take in an object {orderNumber:order#,items:{item-type:qty,item-type:qty}}
    let orderNumber = req.body.orderNumber;
    let items = req.body.items;

    //Set up a workbook
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet(`${orderNumber}`)

    //Set up some styling
    //........

    //set up the headings
    worksheet.cell(1,1,1,2,true).string(`${orderNumber}`);
    worksheet.cell(2,1).string("Image");
    worksheet.cell(2,2).string("QTY");

    //Add our data into the worksheet
    //this works for now, but assumes we only have postcards, in the future we will
    //want to differentiate between diffrent types of items (postcards, notecards, prints, etc)
    Object.keys(items).forEach((cur,dex) => {
        let imgName = cur.split('?')[0]
        worksheet.cell(dex+3,1).string(imgName)
        worksheet.cell(dex+3,2).number(items[cur])
    })

    //write the file and send it to the frontend
    workbook.write('orders/myOrder.xlsx', () => {
       res.sendFile(__dirname + '/orders/myOrder.xlsx');
    });
});


//open the port
const port = process.env.PORT || 5000;

//connect to the db then listen for requests
db.connect(err => {
    if(err){
        console.log('Error connecting to DB..')
        process.exit(1);
    }
    else{
        app.listen(port, () => console.log('Server Is Up! Listening on port 5000'))
    }
})