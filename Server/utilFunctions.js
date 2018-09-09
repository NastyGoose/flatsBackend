const mongoClient = require("mongodb").MongoClient;

 export async function getData(fn) {
    await mongoClient.connect("mongodb+srv://Staaalker:Chernobyl1986@clusterino-beiho.mongodb.net/test?retryWrites=true",
        {useNewUrlParser: true})
        .then((db) => {
            const dbase = db.db("mydb");
            dbase.collection('flats').find().toArray(function(err, result) {
                if (err) throw err;
                fn(result);
                db.close();
            });
        })
        .catch(function (err) { console.log(err) });
}


