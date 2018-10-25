import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const flatsURI = process.env.MONGO_FLATS;

// Set up Mongoose
mongoose.connect(flatsURI,
    { useNewUrlParser: true });

// Initialization of express application
const app = express();

// Using bodyParser middleware
app.use( bodyParser.json() );

// Allow requests from any origin
app.use(cors({ origin: '*' }));

// API routes
require('./routes')(app);

// app.listen(process.env.PORT || 8080, function() {
//     console.log(`Server is up and running on port ${process.env.PORT || 8080}`);
// });

app.listen(8080, function() {
    console.log(`Server is up and running on port 8080`);
});
