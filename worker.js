const cheerio = require('cheerio');
const rp = require('request-promise');
const retry = require('retry-as-promised');
const jsonframe = require('jsonframe-cheerio');
const mongoClient = require("mongodb").MongoClient;

let newFlatsList = [];
let oldFlatList = [];
const uri = "mongodb+srv://Staaalker:Chernobyl1986@clusterino-beiho.mongodb.net/test?retryWrites=true";

function getData() {

    mongoClient.connect(uri, {useNewUrlParser: true})
        .then((db) => {
        const dbase = db.db("mydb");
        dbase.collection("flats").find({}).toArray(function(err, result) {
            if (err) throw err;
            oldFlatList = result;
            db.close();
            });
        })
        .catch(function (err) { console.log(err) })
}

function clearArray() {

    newFlatsList.sort();

    for (let i = 0; i < newFlatsList.length - 1; i++) {
        if((newFlatsList[i].Address === newFlatsList[i + 1].Address)) newFlatsList.splice(i, 1);
    }
}

function parse(url) {
    let paginationEnded = true;

    retry(() => {
        return rp(url)
            .then(function (body) {
                const $ = cheerio.load(body);
                jsonframe($);
                //retrier
                let frame = {
                    flats: {
                        _s: ".b-catalog-table__item",
                        _d: [{
                            "Address": "h3[class=title]",
                            "Price": "div[class=value]"
                        }]
                    }
                };
                // Adding to flats array data from array that store this pages flats info
                newFlatsList = newFlatsList.concat($('body').scrape(frame).flats);
                // pagination
                $('a.b-pagination__item.b-pagination__item_nav.next').each(function () {
                    //console.log(fullFlatsList);
                    paginationEnded = false;
                    parse($(this).attr('href'));
                });
                if (paginationEnded) Compare();
            });
    }, {
        max: 10, // maximum amount of tries, default: 1
        timeout: 10000 // throw if no response or error within milisecnd timeout, default: undefined
    })
    .catch((err) => console.log(err));
}

function Compare() {

    clearArray();

    let store = {}; // объект для коллекции

    for (let i = 0; i < oldFlatList.length; i++) {
        let key = oldFlatList[i].Address; // для каждого элемента создаём свойство
        store[key] = oldFlatList[i].Price; // значение здесь не важно
    }

    mongoClient.connect(uri, {useNewUrlParser: true})
        .then((db) => {
        const dbase = db.db("mydb");

        newFlatsList.forEach((newFlat) => {
            if (newFlat.Price) {
            if (store[newFlat.Address]) {
                if (store.Price !== newFlat.Price) {
                            dbase.collection('flats').updateOne({Address: newFlat.Address}, {$set: {Price: newFlat.Price}});
                }
            } else dbase.collection('flats').insertOne(newFlat);
        }
        });
        db.close();
    })
        .catch((err) => {console.log(err)});
}

getData();
parse('https://www.hata.by/rent-flat/grodno/');
