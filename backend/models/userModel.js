import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [3, "Name should have more than 3 characters"]
    },

    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },

    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false
    },

    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },

    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, { timestamps: true })

// Encrypting password before saving , Password hashing
userSchema.pre("save", async function (next) {
    //1st - updating profile (name, email, image) -- hashed password will hashed again ❌
    //2nd - changing password -- hashed password will hashed again ✅
    if(!this.isModified("password")) {
        return next();
    }
    this.password = await bcryptjs.hash(this.password, 10);
    next();
})

// JWT token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

// verify password
userSchema.methods.verifyPassword = async function (userEnteredPassword) {
    return await bcryptjs.compare(userEnteredPassword, this.password);
}

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex'); //first we generate a random token then convert it to hex string
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex"); //hash the token using sha256 and converting to hex string
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000 // token will expire in 30 minutes
    return resetToken; //return the plain token to send to the user via email
}

export default mongoose.model("User", userSchema);
