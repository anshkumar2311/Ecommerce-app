import handleAsyncError from "../middleware/handleAsyncError.js";
import User from "../models/userModel.js";

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
    res.status(201).json({
        success: true,
        user
    });
})
