import { initializeApp, getApps } from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import "firebase/firestore";
import { getConfig } from "./config";
import { getAnalytics } from "@firebase/analytics";
import { getAuth, signInAnonymously } from "@firebase/auth";

export const initFirebaseClientSDK = () => {
    if (!getApps().length) {
        const { firebaseClientInitConfig } = getConfig();
        if (!firebaseClientInitConfig) {
            throw new Error('Give me the "firebaseClientInitConfig"');
        }
        const app = initializeApp(firebaseClientInitConfig);
        if (typeof window !== "undefined") {
            getAnalytics(app);
            const auth = getAuth(app);
            signInAnonymously(auth);
        }
    }
};
