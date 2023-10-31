const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const colors = require('colors');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
require('dotenv').config();
const path = require('path');

// Database Connection
mongoose.connect(`${process.env.MONGO_URL}/${process.env.MONGO_DBNAME}`).then(success => {
     console.log(`Connection Established with Database`.bgGreen.black);
}).catch(err => {
     console.log(`${err.message}`.bgRed.black);
});

// Loading of Routes for User and Admin
const userRoute = require('../server/routes/userRoutes');
const adminRoute = require('../server/routes/adminRoutes');

app.use("/images", express.static(path.join(__dirname, 'masterImages')));

// Admin and User Routes
app.use('/user', userRoute);
app.use('/admin', adminRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => {
     console.log(`Connection Established with ${PORT}`.bgYellow.black);
});