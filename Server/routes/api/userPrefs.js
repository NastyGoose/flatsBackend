const flats = require('../../flatsLogic/flatsMethods.js');
const lodash = require('lodash');

module.exports = (app) => {
    app.post('/newFavorite', function(req, res) {
        console.log('adding: ', req.body);

        flats.addFavorite(req.body.email, req.body.id)
            .then(data => {
                if (data) return res.send('successfully added');
                return res.send('false');
            })
            .catch(err => res.send(err));
    });

    app.post('/removeFavorite', function(req, res) {
        console.log('removing: ', req.body);

        flats.removeFavorite(req.body.email, req.body.id)
            .then(data => {
                if (data) return res.send('successfully removed');
                return res.send('false');
            })
            .catch(err => res.send(err));
    });

    app.get('/getFavorite/:email', function(req, res) {
        console.log(req.params);

        flats.getFavorite(req.params.email)
            .then(data => {
                console.log('responsing');
                console.log(lodash.compact(data));
               res.send(lodash.compact(data));
            });
    });

    app.get('/getById/:idArr', function(req, res) {
        console.log(req.params);
        const { idArr } = JSON.parse(req.params.idArr);
        flats.getById(idArr)
            .then(data => {
                console.log('data: ', data);
                res.send(data);
            });
    });

    app.get('/findFlat/:address', function(req, res) {
        console.log(req.params);
        const { address } = req.params;
        flats.findFlat(address)
            .then(data => {
                console.log('data: ', data);
            });
    });
};
