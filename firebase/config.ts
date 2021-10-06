export const getConfig = () => ({
    firebaseAdminInitConfig: {
        credential: {
            projectId: "zilmorphs-d6347",
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY
                ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
                : undefined,
        },
        databaseURL: "",
    },
    firebaseClientInitConfig: {
        apiKey: "AIzaSyCpDT_KgcPwUUH7xSDRqQmslBw2Y3fbw60",
        authDomain: "zilmorphs-d6347.firebaseapp.com",
        projectId: "zilmorphs-d6347",
        storageBucket: "zilmorphs-d6347.appspot.com",
        messagingSenderId: "655030386966",
        appId: "1:655030386966:web:25289a00c17b02794c5037",
        measurementId: "G-R3JJBHFQM6",
    },
});
