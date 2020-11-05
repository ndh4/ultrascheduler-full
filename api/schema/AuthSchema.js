import { User, UserTC, ScheduleTC } from "../models";

const AuthQuery = {
    authenticateUser: UserTC.getResolver("authenticate"),
    verifyUser: UserTC.getResolver("verify"),
    verifyToken: UserTC.getResolver("verifyToken"),
};

const AuthMutation = {};

export { AuthQuery, AuthMutation };
