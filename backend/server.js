import app from "./app.js";
import dotenv from 'dotenv';
import { connectMongoDatabase } from "./config/db.js";

dotenv.config({ path: 'backend/config/config.env' });

connectMongoDatabase(); // connect to database

const PORT = process.env.PORT || 3000;

// app.route("/api/v1/products").get(getAllProducts); // use this is good practice but we are using routes file but here .get for get method


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


