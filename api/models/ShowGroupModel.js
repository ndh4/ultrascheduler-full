import { composeWithJson, composeInputWithJson } from 'graphql-compose-json';

import showGroupJSON from '../sample_json/show_group_response.json';

// Why we can do this: https://stackoverflow.com/questions/38380462/syntaxerror-unexpected-token-o-in-json-at-position-1

export const ShowGroupResponseTC = composeWithJson('ShowGroupResponse', showGroupJSON);
export const ShowGroupResponseITC = composeInputWithJson('ShowGroupResponseInput', showGroupJSON);