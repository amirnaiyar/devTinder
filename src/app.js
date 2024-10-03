const express = require('express')

const app = express()


// This will only handle Get call to /user
app.get("/user", (req, res) => {
    console.log(req.method, 'method')
    res.send({
        firstname: "Akshay",
        lastname: "Saini"
    })
})

app.post("/user", (req, res) => {
    console.log(req.method, 'method')
    res.send({
        data: "Data suceessfully saved to the database"
    })
})

app.delete("/user", (req, res) => {
    console.log(req.method, 'method')
    res.send({
        data: "Deleted suceessfully from the database"
    })
})


app.use("/hello/2", (req, res) => {
    res.send("Aabra ka dabra")
})

// This will match all the HTTP method API calls to /hello
app.use("/hello", (req, res) => {
    res.send("server running hello")
})
// app.use("/", (req, res) => {
//     res.send("Home running")
// })
app.listen(3000, () => {
    console.log('server running successful')
})