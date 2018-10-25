const flats = require('../../flatsLogic/flatsMethods.js');
const lodash = require('lodash');
const getter = require('../../flatsLogic/flatsMethods');

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

    app.get('/getById/:idArr', function(req, res) {
        console.log(req.params);
        const { idArr } = JSON.parse(req.params.idArr);
        flats.getById(idArr)
            .then(data => {
                console.log('data: ', data);
                res.send(data);
            });
    });

    app.get('/findFlat/:address/:chunksSize/:page', function(req, res) {
        console.log(req.params);
        const { address, chunksSize, page } = req.params;
        flats.findFlat(address, chunksSize)
            .then(data => {
                if (data.length > 0) {
                    const limits = getter.getLimits(page, data.length - 1);
                    res.send({
                        success: true,
                        payload: {
                            flats: data[page],
                            lastIndex: data.length - 1,
                            pagesIndexes: {
                                startIndex: limits.startIndex,
                                endIndex: limits.endIndex,
                            },
                        },
                    });
                } else {
                    res.send({
                        success: false,
                        message: 'Квартир подходящих под запрос не найдено!',
                    });
                }
            });
    });
};
