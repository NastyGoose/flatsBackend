const lodash = require('lodash');
const { Router } = require('express');
const flats = require('../../flatsLogic/flatsMethods.js');

const router = new Router();

router.post('/newFavorite', (req, res) => {
  console.log('adding: ', req.body);

  flats.addFavorite(req.body.email, req.body.id)
    .then((data) => {
      if (data) return res.send('successfully added');
      return res.send('false');
    })
    .catch(err => res.send(err));
});

router.post('/removeFavorite', (req, res) => {
  console.log('removing: ', req.body);

  flats.removeFavorite(req.body.email, req.body.id)
    .then((data) => {
      if (data) return res.send('successfully removed');
      return res.send('false');
    })
    .catch(err => res.send(err));
});

router.get('/getBalance/:email', (req, res) => {
  flats.getAdditionalData(req.params.email)
    .then((data) => {
      console.log(data);
      if (data) {
        res.send({
          success: true,
          payload: data.message,
        });
      } else {
        res.send({
          success: false,
          payload: [],
        });
      }
    })
    .catch(err => res.send(err));
});

router.get('/getById/:idArr', (req, res) => {
  console.log(req.params);
  const { idArr } = JSON.parse(req.params.idArr);
  flats.getById(idArr)
    .then((data) => {
      console.log('data: ', data);
      res.send(data);
    })
    .catch(err => res.send(err));
});

router.get('/sync', () => {
  flats.sync();
});

module.exports = (app) => {
  app.use('/api/database', router);
};
