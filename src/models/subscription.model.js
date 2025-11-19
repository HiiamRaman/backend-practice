import mongoose from "mongoose";

const  subscriptionSchema =  new mongoose.Schema({
subscriber  : {
    type : mongoose.Schema.Types.ObjectId,
    ref : User,
    required : true
},

channel : {
    type : mongoose.Schema.Types.ObjectId,
    ref : user ,
    required : true
}


},{timestamps: true})





subscriptionSchema.index({subscriber:1, channel : 1},{unique: true})
/*

This tells MongoDB:

For every pair of (subscriber, creator/channel), there must be NO duplicates.
One subscriber can subscribe to the same creator only once.
*/



export const Subscription  = mongoose.model('Subscription' ,subscriptionSchema )
