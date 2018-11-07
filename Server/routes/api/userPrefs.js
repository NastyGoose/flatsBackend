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

router.get('/getAddData/:email', (req, res) => {
  flats.getAdditionalData(req.params.email)
    .then((data) => {
      const seconds = Math.floor((new Date() - data.signUpDate) / 1000);
      const daysSinceSignUp = Math.floor(seconds / (3600 * 24));
      if (data.res.length > 0) {
        res.send({
          success: true,
          payload: lodash.compact(data.res),
          daysSinceSignUp,
        });
      } else {
        res.send({
          success: false,
          payload: [],
          daysSinceSignUp,
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
