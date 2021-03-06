import { Course, Listing, ListingTC } from "../models";

// CRUD Operations

// Create
const ListingMutation = {
    listingCreateOne: ListingTC.getResolver("createOne"),
};

// Read

ListingTC.addResolver({
    name: "findByClass",
    type: [ListingTC],
    args: { input: "String!" },
    resolve: async ({ source, args, context, info }) => {
        let { input } = args;
        
        // 1: Split input at the space
        let [ subject, courseNum ] = input.split(" ");

        // 2: Search courses by course subject & course number -> gets course associated with that
        let course = await Course.findOne({ subject: subject, courseNum: courseNum });

        // Error Check: If course does not exist, no Listings exist with it
        if (!course) {
            return [];
        }

        // // 3: Find Listings associated with course object we retrieved
        let Listings = await Listing.find({ course: course.id});

        return Listings;
    }
})

// Update
const ListingMutation = {
    listingUpdateOne: ListingTC.getResolver("updateOne"),
};

// Delete / Destroy

const ListingMutation = {
    listingRemoveOne: ListingTC.getResolver("removeOne")
    
};



export { ListingQuery, ListingMutation };
