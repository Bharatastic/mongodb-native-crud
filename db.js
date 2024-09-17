const { MongoClient } = require("mongodb");

let dbConnection;

const connectToDB = (cb) => {
    MongoClient.connect('mongodb://localhost:27017/bookstore')
    .then((client) => {
        dbConnection = client.db();
        return cb();
    })
    .catch(err => {
        console.log(err);
        return cb(err);
    });
};

const getDB = () => dbConnection;

module.exports = {
    connectToDB,
    getDB
};