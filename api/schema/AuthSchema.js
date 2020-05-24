import { User, UserTC, ScheduleTC } from '../models';

const AuthQuery = {
    authenticateUser: UserTC.getResolver("authenticate"),
    verifyUser: UserTC.getResolver("verify")
};

const AuthMutation = {
    
};

export { AuthQuery, AuthMutation };