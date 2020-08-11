import { SERVICE_URL } from "../config";

const DeployQuery = {
    service: {
        name: "serviceURL",
        type: "String",
        args: {},
        resolve: () => {
            return SERVICE_URL;
        },
    },
};

export { DeployQuery };
