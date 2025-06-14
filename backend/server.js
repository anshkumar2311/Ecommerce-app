import app from "./app.js";
import dotenv from 'dotenv';
dotenv.config({path:'backend/config/config.env'});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
