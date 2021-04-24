import { Course, Item, ItemTC, Listing, ListingTC } from "../models";

/**
 * Relations (necessary for any fields that link to other types in the schema)
 * https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html#how-to-build-nesting-relations
 */
 ListingTC.addRelation("item", {
    resolver: () => ItemTC.getResolver("findById"),
    prepareArgs: {
        _id: (source) => source.item,
    },
    projection: { item: 1 },
});

// CRUD Operations

// Create

// Read

ListingTC.addResolver({
    name: "filter",
    type: [ListingTC],
    args: {_id: "[ID]", category: "String", subject: "String", type: "String", min_price: "Int!", max_price: "Int!", 
            status: "String", pickup: "String"},
    resolve: async ({ source, args, context, info }) => {

        let matchedIDs, matchedCategoryIDs, matchedTypeIDs = []
        // Get items by courseID if ID inputted by user
        if(args.category == 'Textbook') {
            let matchedCategoryItems = await Item.find({courses : { $in: args._id }});
            matchedCategoryIDs = matchedCategoryItems.map((item)=>{
                return item._id;
            })
            console.log(matchedIDs)
        }

        else{ //is a standardized test
            let matchedCategoryItems = await Item.find({subject: args.subject})
            matchedCategoryIDs = matchedCategoryItems.map((item)=>{
                return item._id;
            })
        }

        if (args.type){
            let matchedTypeItems = await Item.find({type: args.type})
            matchedTypeIDs = matchedTypeItems.map((item)=>{
                return item._id;
            })
        }

        //get intersecting IDs
        if(args._id && args.type){
            matchedIDs = matchedCourseIDs.filter(value => matchedTypeIDs.includes(value));
        }
        else if(args._id){
            matchedIDs = matchedCourseIDs
        }
        else if(args.type){
            matchedIDs = matchedTypeIDs
        }

        // Add the filter fields the user has inputted 
        let base_filter = {item: { $in: matchedIDs}, 
            price: {$gte: args.min_price, $lte: args.max_price},
            availability: args.status, pickup: args.pickup}    
        
        let field_mapping = {_id: 'item', type: 'item', status: 'availability', pickup: 'pickup'}
           
        //instantiate filter
        let filter = { price: {$gte: args.min_price, $lte: args.max_price} };
      
        // For all fields in the filter, add them to our filter
        for (let key in args) {
            if(key) {
                let field = field_mapping[key]
                filter[field] = base_filter[field]
            } 
        }
        
        return Listing.find(filter);
    }
});

// ListingTC.addResolver({
//     name:'findByStatus',
//     type: [ListingTC],
//     args: {status: "String!"},
//     resolve: async ({ source, args, context, info }) => {
//         let matchedItems = await Listing.find({availability: 
//             args.status});
//         return matchedItems;
//     }
// });
// ListingTC.addResolver({
//     name: "findByClass",
//     type: [ListingTC],
//     args: { input: "String!" },
//     resolve: async ({ source, args, context, info }) => {
//         let { input } = args;
        
//         // 1: Split input at the space
//         let [ subject, courseNum ] = input.split(" ");

//         // 2: Search courses by course subject & course number -> gets course associated with that
//         let course = await Course.findOne({ subject: subject, courseNum: courseNum });

//         // Error Check: If course does not exist, no Listings exist with it
//         if (!course) {
//             return [];
//         }

//         // // 3: Find Listings associated with course object we retrieved
//         let Listings = await Listing.find({ course: course.id});

//         return Listings;
//     }
// })

// Update

// Delete / Destroy

const ListingQuery = {
    listingsByFilter: ListingTC.getResolver('filter'),
    listingFindMany: ListingTC.getResolver("findMany"),
    listingFindOne: ListingTC.getResolver("findOne")
};

const ListingMutation = {
    listingCreateOne: ListingTC.getResolver("createOne"),
    listingUpdateOne: ListingTC.getResolver("updateOne"),
    listingRemoveOne: ListingTC.getResolver("removeOne")
};

export { ListingQuery, ListingMutation };
