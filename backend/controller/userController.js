import handleAsyncError from "../middleware/handleAsyncError.js";
import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sentEmail.js";

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


// Reset password
export const requestPasswordReset = handleAsyncError(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new HandleError("User doesn't exists", 400));
    }
    let resetToken;
    try {
        resetToken = user.generatePasswordResetToken(); //generate reset token
        await user.save({ validateBeforeSave: false }); //save the user with reset token and expiry
    }
    catch (error) {
        return next(new HandleError("Could not save reset token, please try again later", 500));
    }

    const resetPasswordURL = `http://localhost/api/v1/reset/${resetToken}`;
    const message = `Use the following link to reset your password: \n\n ${resetPasswordURL} \n\n This link will expire in 30 minutes. \n\n If you did not request this, please ignore this email.`;
    try {
        //send Email
        await sendEmail({
            email: user.email,
            subject: "Password Reset Request",
            message
        })
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })
    }
    catch (error) {
        user.resetPasswordToken = undefined; //clear reset token if user reset its or email could not be sent
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new HandleError("Could not send reset password email, please try again later", 500));
    }
});
