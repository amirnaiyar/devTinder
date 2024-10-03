const validator = require("validator")
const validateSignupData = (req) => {
    const { firstname, lastname, email, password } = req.body

    if(!firstname || !lastname){
        throw new Error("The firstname or lastname not valid");
        
    }

    else if(!validator.isEmail(email)){
        throw new Error("The email is invalid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong");
    }
    else {
        return true
    }
}

module.exports = {
    validateSignupData
}