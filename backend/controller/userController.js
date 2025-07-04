import handleAsyncError from "../middleware/handleAsyncError.js";
import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";
import { sendToken } from "../utils/jwtToken.js";

// Register a new user

export const registerUser = handleAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "this is temp id",
            url: "this is temp url"
        }
    });
    sendToken(user, 201, res);
})


// Login a user

export const loginUser = handleAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    // check if email and password are provided
    if (!email || !password) {
        return next(new HandleError("Please provide email and password", 400));
    }
    // find user by email
    const user = await User.findOne({ email }).select("+password");
    // check if user exists
    if (!user) {
        return next(new HandleError("Invalid email or password", 401));
    }

    const isPasswordValid = await user.verifyPassword(password);
    // check if password is valid
    if (!isPasswordValid) {
        return next(new HandleError("Invalid email or password", 401));
    }
    sendToken(user, 200, res);
})


//Logout a user
export const logout = handleAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
})
