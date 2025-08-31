import express from 'express';
import { roleBasedAccess, verifyUserAuth } from '../middleware/userAuth.js';
import { allMyOrders, createNewOrder, deleteOrder, getAllOrders, getSingleOrder, updateOrderStatus } from '../controller/orderController.js';

const router = express.Router();

//Routes
router.route("/new/order").post(verifyUserAuth, createNewOrder);
router.route("/admin/order/:id")
    .get(verifyUserAuth, roleBasedAccess('admin'), getSingleOrder)
    .put(verifyUserAuth, roleBasedAccess('admin'), updateOrderStatus)
    .delete(verifyUserAuth, roleBasedAccess('admin'), deleteOrder);
router.route("/orders/user").get(verifyUserAuth, allMyOrders);
router.route("/admin/orders").get(verifyUserAuth, roleBasedAccess('admin'), getAllOrders);

export default router;
