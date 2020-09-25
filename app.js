const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Load config
dotenv.config({
  path: './config/config.env'
})

const app = express();

// Body parser
app.use(express.urlencoded({
  extended: false
}))
app.use(express.json());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // this will show more info in the console
}

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
})

// Routes
app.get('/', (req, res) => {
  res.send('Route / not implemented');
});

app.use('/transcribe', require('./routes/transcribe'));

const PORT = process.env.PORT || 4040;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)