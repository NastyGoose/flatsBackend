/* eslint-disable */

const Mockgoose = require('mockgoose').Mockgoose;
const mongoose = require('mongoose');

const FlatSchema = new mongoose.Schema({
  Address: {
    type: String,
    default: '',
    unique: true,
    es_indexed: true,
  },
  Price: {
    type: Number,
    default: '',
    es_indexed: true,
  },
  Description: {
    type: String,
    default: '',
  },
  Photo: {
    type: String,
    default: '',
  },
  AddDate: {
    type: Date,
    default: new Date(),
  },
  UpdateDate: {
    type: Date,
    default: new Date(),
    es_indexed: true,
  },
  URL: {
    type: String,
    default: '',
    unique: true,
  },
});

const Flat = mongoose.model('Flat', FlatSchema);

const mockgoose = new Mockgoose(mongoose);

describe('Database Tests', function () {
  before(function (done) {
    this.timeout(120000);
    mockgoose.prepareStorage().then(() => {
      mongoose.connect('mongodb+srv://Staaalker:Chernobyl1986@clusterino-beiho.mongodb.net/flats?retryWrites=true');
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', () => {
      console.log('We are connected to test database!');
      done();
    });
  });

  describe('Test Database', () => {
    it('New name saved to test database', (done) => {
      const testFlat = Flat({
        Address: 'Сяло лидское',
        Price: 500,
        Description: 'Очень далеко, очень страшно. Зато есть Олег.',
        Photo: 'https://cdn-images-1.medium.com/max/800/1*BLqWm6Jf20GfPj3yuSz6SQ.png',
      });

      testFlat.save(done);
    });
    it('Dont save incorrect format to database', (done) => {
      const wrongSave = Flat({
        notAddress: 123,
        definitelyNotPrice: 'abc',
      });
      wrongSave.save((err) => {
        if (err) { return done(); }
        throw new Error('Should generate error!');
      });
    });
    it('Should retrieve data from test database', (done) => {
      Flat.find({ Address: 'Сяло лидское' }, (err, name) => {
        if (err) { throw err; }
        if (name.length === 0) { throw new Error('No data!'); }
        done();
      });
    });
  });
  after(function (done) {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done);
    });
  });
});
