const mongoose = require("mongoose")

const connectDB = async() => {
    await mongoose.connect("mongodb+srv://namastenode:TjwiQJ9iej8YXGnP@namastenode.2sqxo.mongodb.net/devTinder")
}

module.exports = connectDB
