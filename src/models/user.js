const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const SECRET = "devTinder%01@700"

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        require: true,
        maxLength: 50,
        lowercase: true,
        trim: true,
    },
    lastname: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            const emailRegex = /\S+@\S+\.\S+/
            if(!validator.isEmail(value)){
                throw new Error("Invalid email " + value)
            }
        }
        
    },
    password: {
        type: String,
        require: true,
        maxLength: 100,
        trim: true,
        validate(value){
            const emailRegex = /\S+@\S+\.\S+/
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password should be { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }" + value)
            }
        }
    },
    age: {
        type: Number,
        min: 18,
        trim: true
    },
    gender: {
        type: String,
        lowercase: true,
        trim: true,
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Invalid gender data!")
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about data",
        maxLength: 500,
    },
    imageUrl: {
        type: String,
        trim: true,
        default: "https://p7.hiclipart.com/preview/442/17/110/computer-icons-user-profile-male-user-thumbnail.jpg",
        validate(value){
            const emailRegex = /\S+@\S+\.\S+/
            if(!validator.isURL(value)){
                throw new Error("Invalid url " + value)
            }
        }
    },
    skills: {
        type: [String],
        trim: true,
        validate(value){
            if(value.some(item => item.length > 20)){
                throw new Error("skill length should not be more than 10 characters")
            }
        }
    }
}, {
    timestamps: true
})

userSchema.methods.getJWT = async function () {
    const user = this
    const token = await jwt.sign({
        _id: user._id
      }, SECRET, { expiresIn: '1d' });
      return token
}

userSchema.methods.validatePassword = async function (userInputPassword) {
    const user = this
    const passwordHash = user.password
    const isValidPassword = await bcrypt.compare(userInputPassword, passwordHash)
      return isValidPassword
}

const UserModel = mongoose.model("User", userSchema)

module.exports = UserModel