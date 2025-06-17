import express from 'express';
import product from './routes/productRoutes.js';
import errorHandleMiddleware from './middleware/error.js';

const app = express();

// Middleware
app.use(express.json());

app.use("/api/v1", product); //we have to give only starting path here, because we have given the path in productRoutes.js

// Error handling middleware
app.use(errorHandleMiddleware);

export default app;
