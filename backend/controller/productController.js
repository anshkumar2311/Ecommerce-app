import handleAsyncError from "../middleware/handleAsyncError.js";
import Product from "../models/productModel.js";
import APIFunctionality from "../utils/apiFunctionality.js";
import HandleError from "../utils/handleError.js";

//http://localhost:8000/api/v1/product/684ff74db9884d81b687b43f?Keyword=shirt

//1️⃣ Create Product
export const createProducts = handleAsyncError(async (req, res, next) => {
    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        product
    })
})

//2️⃣ Get all Products
export const getAllProducts = handleAsyncError(async (req, res, next) => {
    const apiFunctionality = new APIFunctionality(Product.find(),req.query).search();

    const products = await apiFunctionality.query
    res.status(200).json({
        success: true,
        products
    })
})


//3️⃣ Update Product
export const updateProduct = handleAsyncError(async (req, res, next) => {
    let product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators:true
    })
    if(!product){
        return next(new HandleError("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        product
    })
})


//4️⃣ Delete Product
export const deleteProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if(!product){
        return next(new HandleError("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })
})


//5️⃣ Accessing single product
export const getSingleProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new HandleError("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        product
    })
})
