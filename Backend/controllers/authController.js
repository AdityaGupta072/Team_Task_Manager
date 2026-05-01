const bcrypt = require("bcryptjs");
const User = require("../models/user");
const generateToken = require("../utils/token");


// SIGNUP
const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        if (password.length < 7) {
            return res.status(400).json({
                message: "Password must be at least 7 characters"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
            role: "MEMBER"
        });

        res.status(201).json({
            message: "User Registered Successfully"
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// LOGIN
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email }); // ✅ FIXED

        if (!existingUser) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const match = await bcrypt.compare(password, existingUser.password);

        if (!match) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const token = generateToken(existingUser);

        res.json({
            token,
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { signup, login };