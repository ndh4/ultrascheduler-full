import { SellerTC } from "../models";

/**
 * Custom Resolvers
 */

// Using auth middleware for sensitive info: https://github.com/graphql-compose/graphql-compose-mongoose/issues/158
const SellerQuery = {
    sellerOne: SellerTC.getResolver("findOne"),
};
const SellerMutation = {};

export { SellerQuery, SellerMutation };
