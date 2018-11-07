import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose';

const mockgoose = new Mockgoose(mongoose);
const flatsURI = process.env.MONGO_FLATS;

mongoose.connect(flatsURI,
  { useNewUrlParser: true });

// if (process.env.NODE_ENV === 'test') {
//   mockgoose.prepareStorage().then(() => {
//     console.log('connected');
//     mongoose.connect(flatsURI);
//   });
// }

// Initialization of express application
const app = express();

// Using bodyParser middleware
app.use(bodyParser.json());

// Allow requests from any origin
app.use(cors({ origin: '*' }));

// API routes
require('./routes')(app);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is up and running on port ${process.env.PORT || 8080}`);
});

module.exports = app;
