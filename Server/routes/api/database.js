const getter = require('../../flatsLogic/flatsMethods');

module.exports = (app) => {
      app.get('/flats', function(req, res) {
          const { query } = req;

          const filter = {
              sort: query.sort,
              order: query.order,
              minPrice: query.minPrice,
              maxPrice: query.maxPrice,
              find: query.find
          };

          // logs
          console.log('sort: ', filter.sort);
          console.log('order: ', filter.order);
          console.log('chunkSize: ', query.chunkSize);
          console.log('minPrice: ', filter.minPrice);
          console.log('maxPrice: ', filter.maxPrice);
          console.log('index: ', query.page);
          console.log('find: ', filter.find);

          getter.getFlats(filter, query.chunkSize)
              .then(data => {
                  console.log('number of chunks: ', data.length);
                  const limits = getter.getLimits(query.page, data.length - 1);
                  console.log('start: ', limits.startIndex);
                  console.log('end: ', limits.endIndex);

                  const response = {
                    lastIndex: data.length - 1,
                    pagesIndexes: {
                        startIndex: limits.startIndex,
                        endIndex: limits.endIndex,
                    },
                    flats: data[query.page],
                  };
                  res.send(response);
      });
    });
  };
