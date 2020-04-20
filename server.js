const express = require("express");
const dotenv = require("dotenv");
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');

//Load env vars
dotenv.config({ path: "./config/config.env" });

// connect to the database
connectDB();

// Route files
const events = require('./routes/events');
const auth = require('./routes/auth');

// Initialize app
const app = express();

// Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());


// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/events', events);
app.use('/api/v1/auth', auth);

app.use(errorHandler);

const PORT = process.env.PORT || 6000;

 const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit process
  server.close(() => process.exit(1));
}); 