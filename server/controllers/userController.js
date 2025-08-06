import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Car from "../models/Car.js"

//generate JWT token
const generateToken = (userid) => {
    // Fixed: payload should be an object with id property
    const payload = { id: userid };
    return jwt.sign(payload, process.env.JWT_SECRET)
}

//register user
export const registerUser = async (req, res)=>{
    try {
        const {name, email, password} = req.body

        if(!name || !email || !password || password.length < 8){
            return res.json({success: false, message: 'Fill all the fields'})
        }

        const userExists = await User.findOne({email})
        if(userExists){
            return res.json({success: false, message: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({name, email, password: hashedPassword})
        const token = generateToken(user._id.toString())
        res.json({success: true, token})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

//login user
export const loginUser = async (req, res)=>{
    try {
        const {email, password} = req.body
        const user =await User.findOne({email})
        
        if(!user){
            return res.json({success: false, message: 'User does not exist'})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({success: false, message: 'Invalid credentials'})
        }

        const token = generateToken(user._id.toString())
        res.json({success: true, token})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Get User data using Token (JWT)
export const getUserData = async (req, res) => {
    try {
        // Fixed: use req.user instead of req.userId, and fix variable name
        const user = req.user;
        res.json({ success: true, user })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

 // Get All Cars for the Frontend
export const getCars = async (req, res) => {
  try {
    const cars = await Car.find({isAvailable: true})
    res.json({success: true, cars})
  } catch (error) {
    console.log(error.message);
    res.json({success: false, message: error.message})
  }
}