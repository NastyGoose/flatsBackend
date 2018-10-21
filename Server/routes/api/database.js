const getter = require('../../flatsLogic/flatsMethods');

module.exports = (app) => {
      app.get('/flats/:sort/:order/:chunkSize/:page', function(req, res) {
          const params = req.params;
          console.log('params: ', req.params);

          const filter = {
              sort: params.sort,
              order: params.order,
          };

          console.log('sort: ', filter.sort);
          console.log('order: ', filter.order);
          console.log('chunkSize: ', params.chunkSize);
          console.log('index: ', params.page);

          getter.getFlats(filter, params.chunkSize)
              .then(data => {
                  console.log('number of chunks: ', data.length);
                  const limits = getter.getLimits(params.page, data.length - 1);
                  console.log('start: ', limits.startIndex);
                  console.log('end: ', limits.endIndex);
                  const response = {
                    lastIndex: data.length - 1,
                    pagesIndexes: {
                        startIndex: limits.startIndex,
                        endIndex: limits.endIndex,
                    },
                    flats: data[params.page],
                  };
                  res.send(response);
      });
    });
  };
