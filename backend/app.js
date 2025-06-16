import express from 'express';
import product from './routes/productRoutes.js';

const app = express();

// Middleware
app.use(express.json());

app.use("/api/v1", product); //we have to give only starting path here, because we have given the path in productRoutes.js

export default app;
