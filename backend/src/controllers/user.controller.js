
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"


const generateJwtToken = (userId) => {
   return jwt.sign({id: userId}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })
}

//signUPUser
const signUpUser = async (req, res) => {
    try {
        const {username, email, password} = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            })
        }

        if (username.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Username must be at least 3 characters long"
            })
        
        }

        const userExistByEmail = await User.findOne({email})
        if (userExistByEmail) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email"
            })
        }

        const userExistByUsername = await User.findOne({username})
        if (userExistByUsername) {
            return res.status(400).json({
                success: false,
                message: "Username already exists with this username"
            })
        }

        const profileImage = ` https://api.dicebear.com/9.x/pixel-art/svg?seed=${username} `


        const user = new User({
            username,
            email,
            password,
            profileImage,
        })

        await user.save()

        const token = generateJwtToken(user._id)
        
        res.status(201).json({
            token,
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            }
        })


        
    } catch (error) {
        console.log("Error in SignUP", error);
        
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"

        })
    }
}

//loginUser
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required"
                })
            }

            const user = await User.findOne({email})
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Credentials"
                })
            }

            const isPasswordMatched = await user.isPasswordCorrect(password)

            if (!isPasswordMatched) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Credentials"
                })
            }

            const token = generateJwtToken(user._id)

            res.status(200).json({
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    profileImage: user.profileImage,
                }
            })
        
    } catch (error) {
        console.log("Error in login user", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
        
    }
}

export {signUpUser, loginUser}