// Import credentials and domain needed for Firebase
import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN } from "./config";

// This import loads the firebase namespace along with all its type information.
import firebase from "firebase/app";

const firebaseConfig = {
	apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
	// later on, we'll talk about other configuration options that you can add
};

firebase.initializeApp(firebaseConfig);

export default firebase;