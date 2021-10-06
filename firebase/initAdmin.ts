import admin from "firebase-admin";
import { getConfig } from "./config";

export const initFirebaseAdminSDK: () => typeof admin = () => {
    if (!admin.apps.length) {
        const { firebaseAdminInitConfig } = getConfig();
        if (!firebaseAdminInitConfig) {
            throw new Error('Give me the "firebaseAdminInitConfig"');
        }
        admin.initializeApp({
            ...firebaseAdminInitConfig,
            credential: admin.credential.cert({
                ...firebaseAdminInitConfig.credential,
            }),
        });
    }
    return admin;
};
