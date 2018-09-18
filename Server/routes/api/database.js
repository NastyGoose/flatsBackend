const util = require('../../util/utilFunctions');

module.exports = (app) => {
util.getData()
  .then(data => {
      app.get('/flats', async function(req, res){
        await res.send(data);
      });
    });
  };
