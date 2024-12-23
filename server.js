const http = require('http'); // Use http unless https is specifically required
const express = require('express');
const mongoose = require('mongoose');

const mongo_uri = "mongodb+srv://saadmusema:admin@ecommerce-market.ogoe6.mongodb.net/ecommerce-market?retryWrites=true&w=majority";
const PORT = process.env.PORT || 4000;

const usersRouter = require("./src/router/user.router");

const app = express();
app.use(express.json());

// Routes
app.use('/v1/users', usersRouter);

app.get('/test', (req, res) => {
    console.log('Request received at /test');
    res.send('Hello, World!');
});

// MongoDB Connection Events
mongoose.connection.once('open', () => {
    console.log('MongoDB connection is ready!');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// Start the Server
const server = http.createServer(app);

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };


async function startServer() {
    try {
        await mongoose.connect(mongo_uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });


        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

startServer();
