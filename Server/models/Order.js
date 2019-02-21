const mongoose = require('mongoose');

const OrdersSchema = new mongoose.Schema({
  Type: {
    type: String,
    default: '',
  },
  Name: {
    type: String,
    default: '',
  },
  Description: {
    type: String,
    default: '',
  },
  Price: {
    type: Number,
    default: 0,
  },
  AddDate: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model('Orders', OrdersSchema);
