const getter = require('../../flatsLogic/flatsMethods');
const lodash = require('lodash');

module.exports = (app) => {
      app.get('/flats', function(req, res) {
          const { query } = req;

          const filter = {
              sort: query.sort,
              order: query.order,
              minPrice: query.minPrice,
              maxPrice: query.maxPrice,
              address: query.address
          };

          // logs
          console.log('sort: ', filter.sort);
          console.log('order: ', filter.order);
          console.log('chunkSize: ', query.chunkSize);
          console.log('minPrice: ', filter.minPrice);
          console.log('maxPrice: ', filter.maxPrice);
          console.log('index: ', query.page);
          console.log('address: ', filter.address);

          getter.getFlats(filter)
              .then(data => {
                  if (data.length && data.length > 0) {
                      const flatsList = lodash.chunk(data, query.chunkSize);

                      console.log('number of chunks: ', flatsList.length);
                      const limits = getter.getLimits(query.page, flatsList.length - 1);
                      console.log('start: ', limits.startIndex);
                      console.log('end: ', limits.endIndex);

                      const response = {
                          success: true,
                          lastIndex: flatsList.length - 1,
                          pagesIndexes: {
                              startIndex: limits.startIndex,
                              endIndex: limits.endIndex,
                          },
                          flats: flatsList[query.page],
                      };
                      res.send(response);
                  } else {
                      const response = {
                          success: false,
                          flats: "Ничего не найдено",
                      };
                      res.send(response);
                  }
      });
    });
  };
