var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

require("../db");
import { composeWithMongoose } from "graphql-compose-mongoose";    
import { Item } from "./ItemModel";
import { User } from "./UserModel";

var ListingSchema = new Schema({
    item: { type: Schema.Types.ObjectID, ref: Item, required: true },
    condition: { type: String, required: true },
    seller: { type: Schema.Types.ObjectID, ref: User, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: false },
    availability: { type: String, required: true },
    pictures: [{ type: String, required: false }]   
});

export const Listing = mongoose.model("listings", ListingSchema);
export const ListingTC = composeWithMongoose(Listing);

