//sets up mongo so we can easily use it
const keys = require('./keys');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const dBName = 'Found_Image';
const url = `mongodb+srv://${keys.user}:${keys.password}@mycluster.4aivn.mongodb.net/${dBName}?retryWrites=true&w=majority`;
const mongoOptions = {useNewUrlParser:true};

const state = {
    db:null
};

const connect = cb => {
    if(state.db){
        cb();
    }
    else{
        MongoClient.connect(url,mongoOptions,(err,client) => {
            if(err){
                cb(err);
            }
            else{
                state.db = client.db(dBName);
                cb();
            }
        });
    }
}

const getPrimaryKey = (_id) => {
    return ObjectId(_id);
}

const getDB = () => {
    return state.db;
}

module.exports = {getDB,connect,getPrimaryKey};