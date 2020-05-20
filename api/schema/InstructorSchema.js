import { Instructor, InstructorTC } from '../models';

const InstructorQuery = {
    instructorOne: InstructorTC.getResolver('findOne')
};

const InstructorMutation = {
    instructorCreateOne: InstructorTC.getResolver('createOne')
};

export { InstructorQuery, InstructorMutation };