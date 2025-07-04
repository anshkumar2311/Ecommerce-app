import express from 'express';
import { createProducts, deleteProduct, getAllProducts, getSingleProduct, updateProduct } from '../controller/productController.js';
import { verifyUserAuth } from '../middleware/userAuth.js';

const router = express.Router();

//Routes

// router.route("/api/v1/products").get(getAllProducts);  // it will not work because we give the starting path in app.js we have to give last path
router.route("/products")
.get(verifyUserAuth, getAllProducts)
.post(createProducts);


router.route("/product/:id")
.put(updateProduct)
.delete(deleteProduct)
.get(getSingleProduct);

export default router;
