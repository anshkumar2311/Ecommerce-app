import app from "./app.js";
import dotenv from 'dotenv';
import { connectMongoDatabase } from "./config/db.js";

dotenv.config({ path: 'backend/config/config.env' });

connectMongoDatabase(); // connect to database

//Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to uncaught exception');
    process.exit(1);
});

const PORT = process.env.PORT || 3000;

// app.route("/api/v1/products").get(getAllProducts); // use this is good practice but we are using routes file but here .get for get method


const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to unhandled promise rejection');
    server.close(() => {
        process.exit(1) // Exit the process with failure code
    })
})
