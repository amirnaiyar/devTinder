const express = require('express')
const bcrypt = require("bcrypt")
const {userAuth} = require("./middlewares/auth")
const validator = require("validator")
const { validateSignupData } = require('./utils/validation')
const PORT = 3000;
var cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken")
var app = express()
app.use(cookieParser())
app.use(express.json());

const SECRET = "devTinder%01@700"

const connectDB = require("./config/database")
const User = require("./models/user")

connectDB().then(() => {
    console.log('databse connected')
    app.listen(PORT, () => {
        console.log('server running successful')
    })
}).catch(err => {
    console.log('cannot connect database.')
})

app.get("/profile", userAuth, async (req, res) => {
    const { token } = req.cookies
    const decodeToken = await jwt.verify(token, SECRET);
    const user = await User.findById(decodeToken._id)
    res.send(user)
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        if (!validator.isEmail(email)) {
            throw new Error("Email id is not correct");
        }
        const user = await User.findOne({ email })
        if (!user) {
            throw new Error("No user found in DB");
        }
        const isValidPassword = await user.validatePassword(password)
        if (!isValidPassword) {
            throw new Error("Password is incorrect");
        } else {
            const token = await user.getJWT()
            res.cookie('token',token, {maxAge : 9999})
            res.send("Login successful!")
        }

    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
})

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    res.send("Connection request sent!")
})

app.post("/signup", async (req, res) => {
    try {
        // Validate Data
        validateSignupData(req)
        // Encrypt the password
        const { firstname, lastname, email, password } = req.body
        const passwordHash = await bcrypt.hash(password, 10)
        console.log(passwordHash)
        // User instance
        const user = new User({
            firstname,
            lastname,
            email,
            password: passwordHash,

        })
        await user.save()
        res.send("User signup successful!")
    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }

})

app.delete("/user/:id", async (req, res) => {
    const { id } = req.params
    try {
        const data = await User.findByIdAndDelete(id);
        res.json("User deleted succeesful!")
    } catch (error) {
        res.status(400).send("Something went wrong")
    }
})

app.patch("/user/:id", async (req, res) => {
    const { id } = req.params
    const data = req.body
    try {
        const ALLOWED_DATA = ["lastname", "age", "gender", "about", "imageUrl", "skills"]
        const isAllowedUpdate = Object.keys(data).every(item => ALLOWED_DATA.includes(item))
        if (!isAllowedUpdate) {
            throw Error("Some fields are not allowed to update")
        }
        if (data.skills.length > 10) {
            throw Error("Skills cannot be more than 10")
        }
        const user = await User.findByIdAndUpdate(
            id,
            req.body,
            { runValidators: true }
        );
        res.json("User data updated successful!")
    } catch (error) {
        res.status(400).send("Something went wrong: " + error.message)
    }
})

app.put("/user", async (req, res) => {
    const { email } = req.body
    try {
        const user = await User.findOneAndUpdate({ email }, req.body);
        res.json(user)
    } catch (error) {
        res.status(400).send("Something went wrong")
    }
})

app.get("/user/:id", async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findById(id);
        res.json(user)

    } catch (error) {
        res.status(400).send("Something went wrong")
    }
})

app.get("/user", async (req, res) => {
    const { email } = req.body
    try {
        const user = await User.findOne({ email });
        res.json(user)

    } catch (error) {
        res.status(400).send("Something went wrong")
    }
})

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({})
        res.json(users)
    } catch (error) {
        res.status(400).send("Something went wrong")
    }
})

