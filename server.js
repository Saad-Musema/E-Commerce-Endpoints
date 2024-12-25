const https = require('https'); // Use http unless https is specifically required
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet')
const fs = require('fs');

const mongo_uri = "mongodb+srv://saadmusema:admin@ecommerce-market.ogoe6.mongodb.net/ecommerce-market?retryWrites=true&w=majority";
const PORT = process.env.PORT || 4000;

const usersRouter = require("./src/router/user.router");
const productRouter = require("./src/router/product.router");

const app = express();
app.use(express.json());
app.use(helmet());

const options = {
    key: fs.readFileSync('./certs/server.key'), // Path to private key
    cert: fs.readFileSync('./certs/server.cert'), // Path to public certificate
};


// Routes
app.use('/v1/users', usersRouter);
app.use('/v1/products',productRouter)




// MongoDB Connection Events
mongoose.connection.once('open', () => {
    console.log('MongoDB connection is ready!');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// Start the Server
const server = https.createServer(options, app);

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };


async function startServer() {
    try {
        await mongoose.connect(mongo_uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });


        server.listen(PORT, () => {
            console.log(`Server is running on https://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

startServer();
