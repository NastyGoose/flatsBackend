const mongoClient = require("mongodb").MongoClient;

function getData() {
    return mongoClient.connect("mongodb+srv://Staaalker:Chernobyl1986@clusterino-beiho.mongodb.net/test?retryWrites=true",
        {useNewUrlParser: true})
        .then((db) => {
            const dbase = db.db("mydb");
            return dbase.collection('flats').find().toArray().finally(() => db.close());
        })
        .catch(function (err) { console.log(err); });
}

getData();
module.exports.getData = getData;
