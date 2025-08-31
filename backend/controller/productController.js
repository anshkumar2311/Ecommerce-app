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


// 7️⃣ Create or Update a Review
export const createReviewForProduct = handleAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const product = await Product.findById(productId);
    if (!product) {
        return next(new HandleError("Product not found", 400));
    }
    const reviewExists = product.reviews.find(review => review.user.toString() === req.user.id.toString());
    if (reviewExists) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user.id.toString()) {
                review.rating = rating;
                review.comment = comment;
            }
        })
    }
    else {
        product.reviews.push(review);
    }
    product.numOfReviews = product.reviews.length;

    let totalRating = 0;
    product.reviews.forEach(review => {
        totalRating += review.rating;
    })
    product.ratings = product.reviews.length > 0 ? totalRating / product.reviews.length : 0;

    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        product
    })
})


// 8️⃣ Get all reviews of a product
export const getProductReviews = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    if (!product) {
        return next(new HandleError("Product not found", 400));
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})


// 9️⃣ Delete a review
export const deleteReview = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product) {
        return next(new HandleError("Product not found", 400));
    }
    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());
    const numOfReviews = reviews.length;
    let totalRating = 0;
    reviews.forEach(review => {
        totalRating += review.rating;
    })
    const ratings = reviews.length > 0 ? totalRating / reviews.length : 0;
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
    })
    res.status(200).json({
        success: true,
        message: "Review deleted successfully"
    })
})
