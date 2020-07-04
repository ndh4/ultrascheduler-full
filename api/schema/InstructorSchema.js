import { Instructor, InstructorTC, SessionTC } from "../models";
import axios from "axios";
import { GraphQLString } from "graphql";
import { GraphQLJSONObject } from "graphql-compose";
const xml2js = require("xml2js");

InstructorTC.addResolver({
  name: "fetchInstructors",
  type: [InstructorTC],
  args: { termcode: "String!" },
  resolve: async ({ source, args, context, info }) => {
    return await axios
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
      .then(async (response) => {
        // console.log("response: ", response.data);
        const test = await xml2js
          .parseStringPromise(response.data)
          .then((result) => {
            const mapped = result["INSTRUCTORS"]["INSTRUCTOR"].map(
              (instructor) => {
                const flattened = instructor["$"];
                const { INI, NAME, WEBID } = flattened;
                const split = NAME.split(",");
                const corrected = split.map((val, index) => {
                  if (!index) return val;
                  return val.substring(1);
                });
                return {
                  INI,
                  WEBID,
                  firstName: corrected[0],
                  lastName: corrected[1],
                };
              }
            );
            // const json = JSON.stringify(result);
            // // console.log(mapped);
            return mapped;
          });
        // console.log(test);
        return test;
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
    type: GraphQLString,
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
