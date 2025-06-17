import express from 'express';
import { createProducts, deleteProduct, getAllProducts, updateProduct } from '../controller/productController.js';

const router = express.Router();

//Routes

// router.route("/api/v1/products").get(getAllProducts);  // it will not work because we give the starting path in app.js we have to give last path
router.route("/products").get(getAllProducts).post(createProducts);
router.route("/product/:id").put(updateProduct).delete(deleteProduct);

export default router;
