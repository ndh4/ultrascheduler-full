import { schemaComposer } from "graphql-compose";
import { composeWithMongoose } from "graphql-compose-mongoose";

var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

require("../db");

var UserSchema = new Schema({
    uid: { type: String, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    netid: { type: String },
    majors: [{ type: String }],
    college: { type: String },
    affiliation: { type: String },
    phone: { type: String },
    token: { type: String },
    recentUpdate: { type: Boolean }, // this field used for displaying banners/modals on version updates
});

export const User = mongoose.model("users", UserSchema);
export const UserTC = composeWithMongoose(User);

// Create a Seller Model as a subset of the User Model
export const SellerTC = UserTC.clone("Seller");