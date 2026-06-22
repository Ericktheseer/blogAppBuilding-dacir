const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

// APP INITIALIZATION
const app = express();
dotenv.config();
const port = process.env.PORT || 4000;

// DATABASE CONNECTION
mongoose.connect(process.env.MONGODB_STRING);
let db = mongoose.connection; 
db.on("error", console.error.bind(console, "connection error"));
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.')); 

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:8000',
        'https://blog-app-buildingclient-dacir.vercel.app'
    ],
    credentials: true,
    optionSuccessStatus: 200
};

app.use(cors(corsOptions));

// ROUTES
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// SERVER START
if(require.main === module){
	app.listen(process.env.PORT || 4000, () => {
	    console.log(`API is now online on port ${ process.env.PORT || 4000 }`)
	});
}

module.exports = {app,mongoose};