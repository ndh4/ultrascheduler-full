import { Course, CourseTC } from '../models';

const CourseQuery = {
    courseOne: CourseTC.getResolver('findOne'),
    courseMany: CourseTC.getResolver('findMany')
};

const CourseMutation = {
    courseCreateOne: CourseTC.getResolver('createOne')
};

export { CourseQuery, CourseMutation };