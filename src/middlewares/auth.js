const jwt = require("jsonwebtoken")
const User = require("../models/user")

const SECRET = "devTinder%01@700"

const userAuth = async (req, res, next) => {
 try {
    const { token } = req.cookies
    if(!token){
        throw Error("Token is not valid!")
    }
    
    const decodeJwt = await jwt.verify(token, SECRET)
    const { _id } = decodeJwt
    const user = await User.findById(_id)
    if(!user){
        throw Error("User not found!")
    }
    next()
    
 } catch (error) {
    res.status(400).send("ERROR: " + error.message)
 }
}


module.exports = {
    userAuth
}