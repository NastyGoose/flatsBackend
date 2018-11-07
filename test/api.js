/* eslint-disable */
import 'babel-polyfill';

const Mockgoose = require('mockgoose').Mockgoose;
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../Server/server');
const User = require('../Server/models/user');

const should = chai.should();
const expect = chai.expect();

chai.use(chaiHttp);

describe('UsersAPI', function() {
  beforeEach(function(done) {
    this.timeout(120000);
    done();
  });
  describe('/GET users addInfo', function() {
    it('it should GET user favorite flats and sign up date', function(done) {
      chai.request(server)
        .get('/api/account/getAddInfo/klis4@gmail.com')
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.have.property('signUpDate');
          res.body.should.have.property('favoriteFlats').to.be.an('array');
          done();
        });
    });
  });
});
