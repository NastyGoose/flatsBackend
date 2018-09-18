import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

// Set up Mongoose
mongoose.connect("mongodb+srv://Staaalker:Chernobyl1986@clusterino-beiho.mongodb.net/test?retryWrites=true",
    { useNewUrlParser: true });
mongoose.Promise = global.Promise;

// Initialization of express application
const app = express();

// Using bodyParser middleware
app.use( bodyParser.json() );

// Allow requests from any origin
app.use(cors({ origin: '*' }));

// API routes
require('./routes')(app);

app.listen(8080, function() {
    console.log(`Server is up and running on port 8080`);
});

