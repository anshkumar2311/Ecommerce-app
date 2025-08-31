import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";
import handleAsyncError from "../middleware/handleAsyncError.js";

//1️⃣ Create New Order
export const createNewOrder = handleAsyncError(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });
    res.status(201).json({
        success: true,
        order
    })
})


//2️⃣ Getting Single Order
export const getSingleOrder = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
        return next(new HandleError("No order found with this Id", 404));
    }
    res.status(200).json({
        success: true,
        order
    })
})


// 3️⃣ Getting Logged in User's Orders
export const allMyOrders = handleAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
    if (!orders) {
        return next(new HandleError("No order found", 404));
    }
    res.status(200).json({
        success: true,
        orders
    })
});


// 4️⃣ Getting All Orders -- Admin
export const getAllOrders = handleAsyncError(async (req, res, next) => {
    const orders = await Order.find();
    if (!orders) {
        return next(new HandleError("No order found", 404));
    }
    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });
    res.status(200).json({
        success: true,
        orders,
        totalAmount
    })
});


// 5️⃣ Update Order Status -- Admin
export const updateOrderStatus = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new HandleError("No order found", 404));
    }
    if (order.orderStatus === "Delivered") {
        return next(new HandleError("This order is already been delivered ", 404));
    }
    await Promise.all(order.orderItems.map(item => updateQuantity(item.product, item.quantity)));
    order.orderStatus = req.body.status;
    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        order
    })
})
async function updateQuantity(id, quantity) {
    const product = await Product.findById(id);
    if (!product) {
        return next(new HandleError("Product not found", 404));
    }
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}


// 6️⃣ Delete Order -- Admin
export const deleteOrder = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new HandleError("No order found", 404));
    }
    if (order.orderStatus !== "Delivered") {
        return next(new HandleError("This order is under processing and cannot be deleted", 404));
    }
    await Order.deleteOne({ _id: req.params.id });
    res.status(200).json({
        success: true,
        message: "Order deleted successfully"
    })
})
