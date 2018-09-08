const date = require('date-and-time');
const cheerio = require('cheerio');
const rp = require('request-promise');
const retry = require('retry-as-promised');
const jsonframe = require('jsonframe-cheerio');
const mongoClient = require("mongodb").MongoClient;
const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'debug'; // default level is OFF - which means no logs at all.

let now = new Date();
let newFlatsList = [];
let oldFlatList = [];
const uri = "mongodb+srv://Staaalker:Chernobyl1986@clusterino-beiho.mongodb.net/test?retryWrites=true";

function getData() {

    mongoClient.connect(uri, {useNewUrlParser: true})
        .then((db) => {
        const dbase = db.db("mydb");
        dbase.collection('flats').find().toArray(function(err, result) {
            if (err) throw err;
            oldFlatList = result;
            dbase.collection('logs').insertOne(
                {
                    "event:": "successfully got data from db",
                    "time:": date.format(now, 'YYYY/MM/DD HH:mm:ss:SS'),
                });
            logger.info("successfully got data from database");
            db.close();
            });
        })
        .catch(function (err) { logger.debug(err) })
}

function clearArray() {

    function compare(a,b) {
        if (a.Address < b.Address)
            return -1;
        if (a.Address > b.Address)
            return 1;
        return 0;
    }

    newFlatsList.sort(compare);

    for (let i = 0; i < newFlatsList.length - 1; i++) {
         if((newFlatsList[i].Address === newFlatsList[i + 1].Address)) {
             logger.error(newFlatsList[i].Address, ":", newFlatsList[i + 1].Address);
             newFlatsList.splice(i, 1);
             i = i - 1;
         }
     }

}

function parse(url) {
    let paginationEnded = true;

    retry(() => {
        return rp(url)
            .then(function (body) {
                const $ = cheerio.load(body);
                jsonframe($);
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
    .catch((err) => logger.error(err));
}

function Compare() {

    clearArray();

    let store = {};

    for (let i = 0; i < oldFlatList.length; i++) {
        let key = oldFlatList[i].Address;
        store[key] = oldFlatList[i].Price;
    }

    mongoClient.connect(uri, {useNewUrlParser: true})
        .then((db) => {
        const dbase = db.db("mydb");

        newFlatsList.forEach((newFlat) => {
            if (newFlat.Price) {
            if (store[newFlat.Address]) {
                if (store[newFlat.Address] !== newFlat.Price) {
                    logger.debug(newFlat.Address, ":", store[newFlat.Address], "=>", newFlat.Price);

                    dbase.collection('flats').updateOne({Address: newFlat.Address}, {$set: {Price: newFlat.Price}});

                    dbase.collection('logs').insertOne(
                        { "event:": "successfully updated data",
                          "time:": date.format(now, 'YYYY/MM/DD HH:mm:ss:SS'),
                          "Address:": newFlat.Address,
                          "previous price:": store[newFlat.Address],
                          "new price:": newFlat.Price
                                });
                    logger.info('successfully updated data');
                }
            }
            else
                {
                dbase.collection('flats').insertOne(newFlat);

                logger.info("successfully inserted data");

                dbase.collection('logs').insertOne(
                    {
                        "event:": "successfully inserted data",
                        "time:": date.format(now, 'YYYY/MM/DD HH:mm:ss:SS'),
                        "Address:": newFlat.Address,
                        "Price:": newFlat.Price
                    });
            }
        }
        });
        db.close();
    })
        .catch((err) => {logger.error(err)});

       deleteSpare();
}

function deleteSpare() {
    let store = {};

    for (let i = 0; i < newFlatsList.length; i++) {
        let key = newFlatsList[i].Address;
        store[key] = newFlatsList[i].Price;
    }

    mongoClient.connect(uri, {useNewUrlParser: true})
        .then((db) => {
            const dbase = db.db("mydb");

            oldFlatList.forEach((oldFlat) => {
                if (!store[oldFlat.Address]) {
                    dbase.collection('flats').deleteOne({Address: oldFlat.Address});
                    dbase.collection('logs').insertOne(
                        {
                            "event:": "successfully deleted data",
                            "time:": date.format(now, 'YYYY/MM/DD HH:mm:ss:SS'),
                            "Address:": oldFlat.Address,
                            "Price:": oldFlat.Price
                        });
                    logger.info('successfully deleted data');
                }
                    });
            db.close();
        })
        .catch((err) => { logger.error(err) });
}

getData();
parse('https://www.hata.by/rent-flat/grodno/');
