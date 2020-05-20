import { Schedule, ScheduleTC } from '../models';

const ScheduleQuery = {
    scheduleOne: ScheduleTC.getResolver('findOne')
};

const ScheduleMutation = {
    scheduleCreateOne: ScheduleTC.getResolver('createOne')
};

export { ScheduleQuery, ScheduleMutation };