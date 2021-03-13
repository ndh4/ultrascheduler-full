import { Course, Listing, ListingTC, Item, ItemTC } from "../models";

// CRUD Operations

// Create

// Read

ListingTC.addResolver({
    name: "findByCourse",
    type: [ListingTC],
    args: { _id: "ID!" },
    resolve: async ({ source, args, context, info }) => {
        // Assume you alr have the course ID

        // 
        let matchedItems = await Item.find({courses : { $in: args._id }});
        let matchedIDs = matchedItems.map((item)=>{
            return item._id;
        })
        console.log(matchedIDs)
        // Use course id to filter
        let filter = {item: { $in: matchedIDs }}


        // const populated = (await Listing.populate("item")).execPopulate();
        // console.log(populated);
        return Listing.find(filter);
    }
});

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
    listingsByCourse: ListingTC.getResolver('findByCourse')
};

const ListingMutation = {
    listingCreateOne: ListingTC.getResolver("createOne"),
    listingUpdateOne: ListingTC.getResolver("updateOne"),
    listingRemoveOne: ListingTC.getResolver("removeOne")
};

export { ListingQuery, ListingMutation };
