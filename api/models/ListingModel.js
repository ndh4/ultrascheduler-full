var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

require("../db");
import { composeWithMongoose } from "graphql-compose-mongoose";    
import { Item } from "./ItemModel";
import { User } from "./UserModel";

const CONDITIONS = ['NEW', 'LIKE NEW', 'USED'];
const STATUSES = ['AVAILABLE', 'PENDING', 'SOLD'];
const PICKUPS = ['On Campus', 'Near Campus', 'Shipped']
const CATEGORIES = ["Standardized Test","Textbook"]
var ListingSchema = new Schema({
    item: { type: Schema.Types.ObjectID, ref: Item, required: true },
    condition: { type: String, required: true, enum: CONDITIONS },
    seller: { type: Schema.Types.ObjectID, ref: User, required: true },
    price: { type: Number, required: true },
    negotiable: { type: Boolean, required: true, default: true },
    description: { type: String, required: false },
    availability: { type: String, required: true, enum: STATUSES },
    pictures: [{ type: String, required: false }],
    pickup: [{type: String, required: true, enum: PICKUPS}],
    category: {type: String, required: true, enum: CATEGORIES}
}, { timestamps: true });

export const Listing = mongoose.model("listings", ListingSchema);
export const ListingTC = composeWithMongoose(Listing);

