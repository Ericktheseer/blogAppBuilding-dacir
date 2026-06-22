const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register
module.exports.registerUser = async (req, res) => {

    try {

        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if(existingUser){
            return res.status(409).send({
                message: "Email already exists"
            });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        return res.status(201).send({
            message: "User registered successfully",
            user: savedUser
        });

    } catch(error){

        return res.status(500).send({
            message: error.message
        });

    }

}

// Login
module.exports.loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if(!user){
            return res.status(404).send({
                message: "User not found"
            });
        }

        const isPasswordCorrect = bcrypt.compareSync(
            password,
            user.password
        );

        if(!isPasswordCorrect){
            return res.status(401).send({
                message: "Invalid credentials"
            });
        }

        const accessToken = jwt.sign(
            {
                id: user._id,
                email: user.email,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" }
        );

        return res.status(200).send({
            access: accessToken
        });

    } catch(error){

        return res.status(500).send({
            message: error.message
        });

    }

}
