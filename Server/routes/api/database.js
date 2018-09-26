const util = require('../../util/utilFunctions');

module.exports = (app) => {
util.getData()
  .then(data => {
      app.get('/flats', function(req, res){
          res.send(data);
      });
    });
  };
