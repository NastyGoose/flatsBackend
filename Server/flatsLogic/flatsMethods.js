// imports
const lodash = require("lodash");
const ObjectID = require('mongodb').ObjectID;
const User = require('../models/user');
const Flat = require('../models/flat');

function addFavorite(email, id) {
    return User
        .findOneAndUpdate({ email: email }, { $push: { "favoriteFlats": id } })
        .catch((err) => console.log('caught err: ', err));
}

function removeFavorite(email, id) {
    return User
        .findOneAndUpdate({ email: email }, { $pull: { "favoriteFlats": id } })
        .catch((err) => console.log('caught err: ', err));
}

function getById(arr) {
    const idArr = arr.map(curr => ObjectID(curr));
    return Flat
        .find({ _id: { $in: idArr } })
        .then((res) => {
            return(res);
        })
        .catch((err) => console.log('caught err: ', err));
}

function getFavorite(email) {
    return User
        .findOne({ email: email })
        .then((res) => {
            const idArr = res.favoriteFlats.map(curr =>ObjectID(curr));
            return Flat
                .find({ _id: { $in: idArr } })
                .then(res => res);
                })
        .catch((err) => console.log('caught err in getFavorite: ', err));
}

function getFlats(filter, chunkSize) {
    console.log('filter: ', filter);
    console.log('chunksSize: ', chunkSize);
    switch (filter.sort) {
        case 'Date':
            return Flat
                .find({ Price: { $gte: filter.minPrice, $lte: filter.maxPrice }})
                .sort({ UpdateDate: parseInt(filter.order, 10) })
                .then((res) => {
                    return lodash.chunk(res, chunkSize);
                })
                .catch((err) => console.log(err));
        case 'Price':
            return Flat
                .find({ Price: { $gte: filter.minPrice, $lte: filter.maxPrice }})
                .sort({ Price: parseInt(filter.order, 10) })
                .then((res) => {
                    return lodash.chunk(res, chunkSize);
                })
                .catch((err) => console.log(err));
        default:
            return Flat
                .find({ Price: { $gte: filter.minPrice, $lte: filter.maxPrice }})
                .then((res) => {
                    return lodash.chunk(res, chunkSize);
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

async function findFlat(address, chunksSize) {
    console.log(address);
    return new Promise(resolve => Flat.search(
        {query_string: {query: address}},
        {hydrate: true},
    (err, res) => {
            if (err) console.log('error: ', err);
            console.log('result: ', res.hits.hits.length);
            resolve(lodash.chunk(res.hits.hits, chunksSize));
    }));
}

function sync() {
    const stream = Flat.synchronize();
    let count = 0;

    stream.on('data', (err, doc) => {
        count++;
    });
    stream.on('close', () => {
        console.log('indexed ' + count + ' document!');
    });
    stream.on('error', (err) => {
        console.log(err);
    });
}

// exports
module.exports.findFlat = findFlat;
module.exports.getById = getById;
module.exports.getFavorite = getFavorite;
module.exports.addFavorite = addFavorite;
module.exports.removeFavorite = removeFavorite;
module.exports.getLimits = getLimits;
module.exports.getFlats = getFlats;
