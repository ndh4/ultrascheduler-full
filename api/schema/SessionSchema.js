import { Session, SessionTC } from '../models';

const SessionQuery = {
    sessionOne: SessionTC.getResolver('findOne')
};

const SessionMutation = {
    sessionCreateOne: SessionTC.getResolver('createOne')
};

export { SessionQuery, SessionMutation };