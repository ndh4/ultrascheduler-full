import * as admin from "firebase-admin";

const serviceAccount = require("./hedwig-279117-firebase-adminsdk-kwvqm-13fadb29d6");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://hedwig-279117.firebaseio.com",
});
