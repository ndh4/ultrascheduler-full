import { Course, CourseTC, Session, SessionTC } from '../models';
import { toInputObjectType } from 'graphql-compose';

/**
 * THIS IS THE MOST IMPORTANT LINE HERE - IT TOOK ALMOST 2 WEEKS TO GET THIS RIGHT
 * PLEASE DO NOT REMOVE
 * THIS IS THE BEST WAY TO DO RELATIONS WHEN YOU HAVE A SUBFIELD THAT IS A SEPARATE 
 * MONGO COLLECTION WHICH LINKS TO THE CURRENT MONGO COLLECTION ON ONE FIELD; YOU JUST HAVE TO 
 * DO THIS AND USE THE "source._id" in the "resolve" field (and projection of that _id in the "projection" field) 
 */
CourseTC.addFields({
    sessions: ({
        type: [SessionTC],
        args: SessionTC.getResolver("findMany").getArgs(),
        resolve: (source, args, context, info) =>
            SessionTC.getResolver("findMany").resolve({
                source,
                // Copy any args the user passes in for this subfield, but also filter by the parent course
                args: {...args, filter: { ...args.filter, course: source._id } }, 
                context,
                info
            }),
        projection: {
            _id: true
        }
    })
});

CourseTC.addResolver({
    name: "findManyInSubject",
    type: [CourseTC],
    args: { subject: "String!", ascending: "Boolean!" },
    resolve: async ({ source, args, context, info }) => {
        // -(field) puts into descending order
        let sortParam = args.ascending ? "courseNum" : "-courseNum";
        return await Course.find({ subject: args.subject }).sort(sortParam);
    }
})

const CourseQuery = {
    courseOne: CourseTC.getResolver('findOne'),
    courseMany: CourseTC.getResolver('findMany')
    .addSortArg({
        name: "COURSE_NUM_ASC",
        description: "Simple sort by course number in ascending order.",
        value: { courseNum: 1 }
    })
    .addSortArg({
        name: "COURSE_NUM_DESC",
        description: "Simple sort by course number in descending order.",
        value: { courseNum: -1 }
    }),
    courseManyInSubject: CourseTC.getResolver('findManyInSubject')
};

const CourseMutation = {
    courseCreateOne: CourseTC.getResolver('createOne')
};

export { CourseQuery, CourseMutation };