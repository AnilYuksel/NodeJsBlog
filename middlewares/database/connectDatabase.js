const mongoose = require("mongoose")

const connectDatabase = () => {
    mongoose
    .connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("Connected to Mongo Db")
    })
    .catch((err)=>{
        console.log(err)
    })
}

module.exports = connectDatabase