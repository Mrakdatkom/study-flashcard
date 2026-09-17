import mongoose from "mongoose";
import bcrypt from "bcrypt";
import AppError from "../utils/AppError.js";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [3, "Name must be at least 3 characters long."]
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be atleast 6 characters long'],
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
});

userSchema.post('save', function (doc) {
    console.log(`New user saved: ${doc.name}`);
});

// Login function
userSchema.statics.login = async function (email, password) {
    if (typeof email !== 'string') {
        throw new AppError('Email must be a string', 400);
    }

    // Convert the email to lowercase
    const user = await this.findOne({ email: email.toLowerCase() }).select('+password');

    // Check if credentials matched db data
    if (!user || !(await user.matchPassword(password))) {
        throw new AppError('Invalid email or password.', 401);
    }

    return user;
};

// Compare Hashed Password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// Authenticated User Credentials
userSchema.methods.getPublicProfile = function () {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
    }
};

const User = mongoose.model("User", userSchema);

export default User;