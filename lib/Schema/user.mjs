import mongoose from "mongoose";
const Schema = mongoose.Schema
const mailSchema = new Schema({
    address: String,
    password: String,
    date: Date,
    token: String
})
const MailModel = mongoose.model('MailModel', mailSchema)

export{MailModel}