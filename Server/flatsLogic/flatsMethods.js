// imports
const ObjectID = require('mongodb').ObjectID;
const User = require('../models/user');
const Flat = require('../models/flat');

function addFavorite(email, id) {
  return User
    .findOneAndUpdate({ email }, { $push: { favoriteFlats: id } })
    .catch(err => console.log('caught err: ', err));
}

function removeFavorite(email, id) {
  return User
    .findOneAndUpdate({ email }, { $pull: { favoriteFlats: id } })
    .catch(err => console.log('caught err: ', err));
}

function getById(arr) {
  const idArr = arr.map(curr => ObjectID(curr));
  return Flat
    .find({ _id: { $in: idArr } })
    .then(res => (res))
    .catch(err => console.log('caught err: ', err));
}

function getAdditionalData(email) {
  return User
    .findOne({ email })
    .then((res) => {
      if (res) {
        return {
          success: true,
          message: res.balance,
        };
      }
      return {
        success: false,
        message: 'no such user',
      };
    })
    .catch(err => console.log('caught err in getFavorite: ', err));
}

function getFlats(filter) {
  const matchObj = filter.address && filter.address !== '' ? {
    match: {
      Address: {
        query: filter.address,
      },
    },
  } : { match_all: {} };
  switch (filter.sort) {
    case 'Date':
      return new Promise(resolve => Flat
        .esSearch({
          sort: { UpdateDate: { order: filter.order } },
          size: 1000,
          query: {
            bool: {
              filter: {
                range: {
                  Price: {
                    gte: filter.minPrice || 0,
                    lte: filter.maxPrice || 3000,
                  },
                },
              },
              must: matchObj,
            },
          },
        }, { hydrate: true },
        (err, res) => {
          if (err) console.log('error: ', err);
          resolve(res.hits.hits);
        }));
    case 'Price':
      return new Promise(resolve => Flat
        .esSearch({
          sort: { Price: { order: filter.order } },
          size: 1000,
          query: {
            bool: {
              filter: {
                range: {
                  Price: {
                    gte: filter.minPrice || 0,
                    lte: filter.maxPrice || 3000,
                  },
                },
              },
              must: matchObj,
            },
          },
        }, { hydrate: true },
        (err, res) => {
          if (err) console.log('error: ', err);
          resolve(res.hits.hits);
        }));
    default:
      return new Promise(resolve => Flat
        .esSearch({
          size: 1000,
          query: {
            bool: {
              filter: {
                range: {
                  Price: {
                    gte: filter.minPrice || 0,
                    lte: filter.maxPrice || 3000,
                  },
                },
              },
              must: matchObj,
            },
          },
        },
        (err, res) => {
          if (err) console.log('error: ', err);
          resolve(res.hits.hits);
        }));
  }
}

function getLimits(page, length) {
  page = parseInt(page, 10);
  switch (page) {
    case 0:
      return {
        startIndex: 0,
        endIndex: page + 4,
      };
    case 1:
      return {
        startIndex: 0,
        endIndex: page + 3,
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

async function sync() {
  const stream = Flat.synchronize();
  let count = 0;

  stream.on('data', () => {
    count++;
  });
  stream.on('close', () => {
    console.log(`indexed ${count} document!`);
  });
  stream.on('error', (err) => {
    console.log(err);
  });
}

// exports
module.exports.sync = sync;
module.exports.getById = getById;
module.exports.getAdditionalData = getAdditionalData;
module.exports.addFavorite = addFavorite;
module.exports.removeFavorite = removeFavorite;
module.exports.getLimits = getLimits;
module.exports.getFlats = getFlats;
