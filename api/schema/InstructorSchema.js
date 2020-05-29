import { Instructor, InstructorTC, SessionTC } from '../models';

// Create a field NOT on the mongoose model; easy way to fetch sessions that an instructor teaches
InstructorTC.addFields({
    sessions: ({
        type: [SessionTC],
        args: SessionTC.getResolver("findMany").getArgs(),
        resolve: (source, args, context, info) =>
            SessionTC.getResolver("findMany").resolve({
                source,
                // Copy any args the user passes in for this subfield, but also filter by the parent course
                args: {...args, filter: { ...args.filter, instructors: source._id } }, 
                context,
                info
            }),
        projection: {
            _id: true
        }
    })
});

const InstructorQuery = {
    instructorOne: InstructorTC.getResolver('findOne'),
    instructorMany: InstructorTC.getResolver('findMany'),
};

const InstructorMutation = {
    instructorCreateOne: InstructorTC.getResolver('createOne')
};

export { InstructorQuery, InstructorMutation };