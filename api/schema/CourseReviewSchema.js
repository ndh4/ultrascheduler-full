import {Session, SessionTC, Course, CourseTC, CourseReview, CourseReviewTC, Instructor, InstructorTC} from '../models';

// used to access fields belonging to session
CourseReviewTC.addRelation("session", {
    resolver: () => SessionTC.getResolver("findById"),
    prepareArgs: {
        _id: (source) => source.session,
    },
    projection: { session: 1 },
});

CourseReviewTC.addRelation("course", {
    resolver: () => CourseTC.getResolver("findById"),
    prepareArgs: {
        _id: (source) => source.course,
    },
    projection: { course: 1 },
});

CourseReviewTC.addRelation("instructor", {
    resolver: () => CourseTC.getResolver("findById"),
    prepareArgs: {
        _id: (source) => source.instructor,
    },
    projection: { course: 1 },
});

// to generate all reviews for a course (for a semester + year)
    // run for-loop for all sessions associated with course 

// may not need: session_id: "ID!", 
//used on course review page to load review information
    // 
CourseReviewTC.addResolver({
    name: "findReviews",
    type: [CourseReviewTC],
    args: {course_id: "ID!", term: "String!",  
            optional_filters: {motive: "[String]", professor: "[ID]", year: "[Int]" } },
    resolve: async ({ source, args, context, info }) => {

        const filter = {};
        // For all fields in the filter, add them to our filter
        for (let key of Object.keys(args.filter)) {
            filter[key] = args.filter[key];
        }

        const reviews = await CourseReview.find(filter);

        console.log(reviews);

        return reviews;

        // var filtered_sessions;
        // // find all sessions associated with course and term
        // let filter = { course: { $in: [args.course_id] } };
        // if (args.filter) {
        //     // For all fields in the filter, add them to our filter
        //     for (let key of Object.keys(args.filter)) {
        //         filter[key] = args.filter[key];
        //     }
        // }
        // filtered_sessions = Session.find(filter);




        // var obj = {session: args.session_id}
        
        // if (args.major){
        //     obj["major"] = args.major
        // }

        // if(args.year){
        //     obj["year"] = args.year
        // }

        return CourseReview.find(obj);

    }
}
);

const CourseReviewQuery = {
    courseReviewsBySession: CourseReviewTC.getResolver('findReviews'),

};

const CourseReviewMutation = {
    courseReviewCreateOne: CourseReviewTC.getResolver("createOne"),
    courseReviewUpdateOne: CourseReviewTC.getResolver("updateOne"),
    courseReviewRemoveOne: CourseReviewTC.getResolver("removeOne")
};

export { CourseReviewQuery, CourseReviewMutation };
