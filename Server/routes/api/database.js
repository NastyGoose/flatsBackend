const Orders = require('../../models/Order');

module.exports = (app) => {
  app.post('/database/addOrder', (req, res) => {
    const { body } = req;

    Orders.create(body)
      .then(() => {
        console.log('creating order', body);
        res.send('success');
      });
  });
};
