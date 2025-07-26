import handleAsyncError from "../middleware/handleAsyncError.js";
import Product from "../models/productModel.js";
import APIFunctionality from "../utils/apiFunctionality.js";
import HandleError from "../utils/handleError.js";

//http://localhost:8000/api/v1/product/684ff74db9884d81b687b43f?Keyword=shirt

//1️⃣ Create Product
export const createProducts = handleAsyncError(async (req, res, next) => {
    req.body.user = req.user.id;

    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        product
    })
})

//2️⃣ Get all Products
export const getAllProducts = handleAsyncError(async (req, res, next) => {
    const resultsPerPage = 1;
    const apiFeatures = new APIFunctionality(Product.find(), req.query).search().filter();

    // Getting filtered query before pagination
    const filteredQuery = apiFeatures.query.clone();
    const productCount = await filteredQuery.countDocuments();

    //calculate the total number of pages based on the product count
    const totalPages = Math.ceil(productCount / resultsPerPage);
    const page = Number(req.query.page) || 1;

    if (page > totalPages && productCount > 0) {
        return next(new HandleError("This page does not exist", 404));
    }

    //Apply Pagination
    apiFeatures.pagination(resultsPerPage);
    const products = await apiFeatures.query;

    if (!products || products.length === 0) {
        return next(new HandleError("No product found", 404));
    }
    res.status(200).json({
        success: true,
        products,
        productCount,
        resultsPerPage,
        totalPages,
        currentPage: page
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


//6️⃣ Admin Get all Products
export const getAdminProducts = handleAsyncError(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products
    })
})
