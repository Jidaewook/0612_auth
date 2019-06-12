const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');

const mongoose = require('mongoose');

const app = express();
const db = require('./config/keys').mongoURI;

mongoose.connect(db, {useNewUrlParser: true})
    .then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log(err));

mongoose.Promise = global.Promise;

mongoose.set('useCreateIndex', true)


//Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

//Routes
app.use('/users', userRouter);


const PORT = process.env.PORT || 3000;

app.listen(PORT);

console.log(`http://localhost:${PORT}`);