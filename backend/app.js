import express from 'express';
import product from './routes/productRoutes.js';
import user from './routes/userRoutes.js';
import errorHandleMiddleware from './middleware/error.js';
import cookieParser from 'cookie-parser';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser())

app.use("/api/v1", product); //we have to give only starting path here, because we have given the path in productRoutes.js
app.use("/api/v1", user);

// Error handling middleware
app.use(errorHandleMiddleware);

export default app;
