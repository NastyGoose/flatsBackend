const mongoClient = require("mongodb").MongoClient;
const lodash = require("lodash");
const ObjectID = require('mongodb').ObjectID;

const uri = process.env.MONGO_FLATS;

function addFavorite(email, id) {
    return mongoClient.connect(uri,
        { useNewUrlParser: true })
        .then((db) => {
            const dbase = db.db("flats");
            return dbase.collection('users')
                .findOneAndUpdate({ email: email }, { $push: { "favoriteFlats": id } })
                .finally(() => db.close());
        })
        .catch((err) => console.log('caught err: ', err));
}

function removeFavorite(email, id) {
    return mongoClient.connect(uri,
        { useNewUrlParser: true })
        .then((db) => {
            const dbase = db.db("flats");
            return dbase.collection('users')
                .findOneAndUpdate({ email: email }, { $pull: { "favoriteFlats": id } })
                .finally(() => db.close());
        })
        .catch((err) => console.log('caught err: ', err));
}

function getById(arr) {
    const idArr = arr.map(curr => ObjectID(curr));
    return mongoClient.connect(uri,
        { useNewUrlParser: true })
        .then((db) => {
            const dbase = db.db("flats");
            return dbase.collection('flats')
                .find({ _id: { $in: idArr } })
                .toArray()
                .then((res) => {
                    console.log(res);
                    return(res);
                });

        })
        .catch((err) => console.log('caught err: ', err));
}

function getFavorite(email) {
    return mongoClient.connect(uri,
        { useNewUrlParser: true })
        .then((db) => {
            const dbase = db.db("flats");
            return dbase.collection('users')
                .findOne({ email: email })
                .then((res) => {
                    const idArr = res.favoriteFlats.map(curr =>ObjectID(curr));
                    return dbase.collection('flats')
                        .find({ _id: { $in: idArr } })
                        .toArray()
                        .then(res => res)
                        .finally(() => db.close());
                });

        })
        .catch((err) => console.log('caught err: ', err));
}

function getFlats(filter, chunkSize) {
    switch (filter.sort) {
        case 'Date':
            return mongoClient.connect(uri,
                { useNewUrlParser: true })
                .then((db) => {
                    const dbase = db.db("flats");
                    return dbase.collection('flats')
                        .find()
                        .sort({ UpdateDate: parseInt(filter.order, 10) })
                        .toArray()
                        .then((res) => {
                            return lodash.chunk(res, chunkSize);
                        })
                        .finally(() => db.close());
                })
                .catch((err) => console.log(err));
        case 'Price':
            return mongoClient.connect(uri,
                { useNewUrlParser: true })
                .then((db) => {
                    const dbase = db.db("flats");
                    return dbase.collection('flats')
                        .find()
                        .sort({ Price: parseInt(filter.order, 10) })
                        .toArray()
                        .then((res) => {
                            return lodash.chunk(res, chunkSize);
                        })
                        .finally(() => db.close());
                })
                .catch((err) => console.log(err));
        default:
            return mongoClient.connect(uri,
                { useNewUrlParser: true })
                .then((db) => {
                    const dbase = db.db("flats");
                    return dbase.collection('flats')
                        .find()
                        .toArray()
                        .then((res) => {
                        return lodash.chunk(res, chunkSize);
                        })
                        .finally(() => db.close());
                    // this.flats = lodash.chunk(flats, chunkSize);
                })
                .catch((err) => console.log(err));
    }
}

function getLimits(page, length) {
    page = parseInt(page, 10);
    switch (page) {
        case 0:
            return {
                startIndex: 0,
                endIndex: page + 4
            };
        case 1:
            return {
                startIndex: 0,
                endIndex: page + 3
            };
        case length - 1:
            return {
                startIndex: page - 3,
                endIndex: page + 1,
            };
        case length:
            return {
                startIndex: page - 4,
                endIndex: page,
            };
        default:
        return {
            startIndex: page - 2,
            endIndex: page + 2,
        };
    }
}

module.exports.getById = getById;
module.exports.getFavorite = getFavorite;
module.exports.addFavorite = addFavorite;
module.exports.removeFavorite = removeFavorite;
module.exports.getLimits = getLimits;
module.exports.getFlats = getFlats;
