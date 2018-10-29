const flats = require('../../flatsLogic/flatsMethods.js');
const lodash = require('lodash');

const { Router } = require('express');

const router = new Router();


router.post('/newFavorite', function(req, res) {
        console.log('adding: ', req.body);

        flats.addFavorite(req.body.email, req.body.id)
            .then(data => {
                if (data) return res.send('successfully added');
                return res.send('false');
            })
            .catch(err => res.send(err));
});

router.post('/removeFavorite', function(req, res) {
        console.log('removing: ', req.body);

        flats.removeFavorite(req.body.email, req.body.id)
            .then(data => {
                if (data) return res.send('successfully removed');
                return res.send('false');
            })
            .catch(err => res.send(err));
});

router.get('/getFavorite/:email', function(req, res) {
        console.log(req.params);

        flats.getFavorite(req.params.email)
            .then(data => {
               if (data.length > 0) {
                   res.send({
                       success: true,
                       payload: lodash.compact(data)
               });
               } else {
                   res.send({
                       success: false,
                       payload: []
                   });
               }
            });
});

router.get('/getById/:idArr', function(req, res) {
        console.log(req.params);
        const { idArr } = JSON.parse(req.params.idArr);
        flats.getById(idArr)
            .then(data => {
                console.log('data: ', data);
                res.send(data);
            });
});

router.get('/sync', function() {
        flats.sync();
});

module.exports = (app) => {
    app.use('/api/database', router);
};
