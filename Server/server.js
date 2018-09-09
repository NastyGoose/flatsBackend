import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { getData } from './utilFunctions';

 let data = getData((res) => {
    data = res;
});

// Initialization of express application
const app = express();

// Using bodyParser middleware
app.use( bodyParser.json() );

// Allow requests from any origin
app.use(cors({ origin: '*' }));

// RESTful api handlers
app.get('/', async function(req, res){
    await res.send(data);
});

app.listen(8080, function() {
    console.log(`Server is up and running on port 8080`);
});
