import { Instructor, InstructorTC, SessionTC } from "../models";
import axios from "axios";
import { GraphQLString } from "graphql";
import { GraphQLJSONObject } from "graphql-compose";
const xml2js = require("xml2js");

InstructorTC.addResolver({
  name: "fetchInstructors",
  type: InstructorTC,
  args: { termcode: "String!" },
  resolve: ({ source, args, context, info }) => {
    console.log("args.termcode", args.termcode);
    return axios
      .get(
        "https://esther.rice.edu/selfserve/!swkscmp.ajax?p_data=INSTRUCTORS&p_term=" +
          args.termcode,
        {
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:3001",
            "Access-Control-Allow-Headers":
              "Origin, X-Requested-With, Content-Type, Accept",
          },
        }
      )
      .then((response) => {
        console.log("response: ", response.data);
        return xml2js.parseString(response.data, (err, result) => {
          if (err) {
            console.log("Cannot parse xml to json because ", err);
          }
          const json = JSON.stringify(result);
          console.log(json);
          return json;
        });
      })
      .catch((error) => {
        console.log("error fetching data", error);
      });
  },
});

// Create a field NOT on the mongoose model; easy way to fetch sessions that an instructor teaches
InstructorTC.addFields({
  sessions: {
    type: [SessionTC],
    args: SessionTC.getResolver("findMany").getArgs(),
    resolve: (source, args, context, info) =>
      SessionTC.getResolver("findMany").resolve({
        source,
        // Copy any args the user passes in for this subfield, but also filter by the parent course
        args: { ...args, filter: { ...args.filter, instructors: source._id } },
        context,
        info,
      }),
    projection: {
      _id: true,
    },
  },

  webIDs: {
    type: GraphQLJSONObject,
    args: InstructorTC.getResolver("fetchInstructors").getArgs(),
    resolve: (source, args, context, info) =>
      InstructorTC.getResolver("fetchInstructors").resolve({
        source,
        args,
        context,
        info,
      }),
  },
});

const InstructorQuery = {
  instructorOne: InstructorTC.getResolver("findOne"),
  instructorMany: InstructorTC.getResolver("findMany"),
  instructorList: InstructorTC.getResolver("fetchInstructors"),
};

const InstructorMutation = {
  instructorCreateOne: InstructorTC.getResolver("createOne"),
};

export { InstructorQuery, InstructorMutation };
