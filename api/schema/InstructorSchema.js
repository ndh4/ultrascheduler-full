import { InstructorTC, SessionTC } from "../models";
import axios from "axios";
import { GraphQLString } from "graphql";
const xml2js = require("xml2js");
const parser = new xml2js.Parser();

// API GET request to fetch the instructors with their webIds
InstructorTC.addResolver({
  name: "fetchInstructors",
  type: [InstructorTC],
  args: { termcode: "String!" },
  resolve: async ({ source, args, context, info }) => {
    return await axios
      .get(
        "https://esther.rice.edu/selfserve/!swkscmp.ajax?p_data=INSTRUCTORS&p_term=" +
          args.termcode
      )
      .then(async (response) => {
        // Parse xml to json
        const test = await parser
          .parseStringPromise(response.data)
          .then((result) => {
            const mapped = result["INSTRUCTORS"]["INSTRUCTOR"].map(
              (instructor) => {
                const flattened = instructor["$"];
                const { INI, NAME, WEBID } = flattened;
                // Get the instructors firstname and lastname
                const split = NAME.split(",");
                const corrected = split.map((val, index) => {
                  // Remove the extra " " in front of firstname
                  if (!index) return val;
                  return val.substring(1);
                });
                return {
                  INI,
                  webId: WEBID,
                  firstName: corrected[1],
                  lastName: corrected[0],
                };
              }
            );
            return mapped;
          });
        return test;
      })
      .catch((error) => {
        console.log("error fetching data", error);
        return [];
      });
  },
});

// Create a field NOT on the mongoose model; easy way to fetch sessions that an instructor teaches
InstructorTC.addFields({
  webId: {
    type: GraphQLString,
  },
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
