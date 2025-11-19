import mongoose from "mongoose";

const  subscriptionModel =  new mongoose.Schema({},{timestamps: true})
export const Subscription  = mongoose.model('Subscription' ,subscriptionModel )
