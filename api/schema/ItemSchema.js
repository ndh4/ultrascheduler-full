import { Course, Item, ItemTC } from "../models";

// CRUD Operations

// Create

// Read

ItemTC.addResolver({
    name: "findByClass",
    type: [ItemTC],
    args: { input: "String!" },
    resolve: async ({ source, args, context, info }) => {
        let { input } = args;

        // 1: Split input at the space
        let [subject, courseNum] = input.split(" ");

        // 2: Search courses by course subject & course number -> gets course associated with that
        let course = await Course.findOne({
            subject: subject,
            courseNum: courseNum,
        });

        // Error Check: If course does not exist, no items exist with it
        if (!course) {
            return [];
        }

        // // 3: Find items associated with course object we retrieved
        let items = await Item.find({ course: course.id });

        return items;
    },
});

// Update

// Delete / Destroy

const ItemQuery = {
    findCourse: ItemTC.getResolver("findByClass"),
};

const ItemMutation = {};

export { ItemQuery, ItemMutation };
