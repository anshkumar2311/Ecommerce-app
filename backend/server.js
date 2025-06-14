import app from "./app.js";
import dotenv from 'dotenv';
dotenv.config({path:'backend/config/config.env'});

const PORT = process.env.PORT || 3000;

// app.get("/api/v1/products", getAllProducts);   // use this is not good practice
// app.route("/api/v1/products").get(getAllProducts); // use this is good practice but we are using routes file



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
