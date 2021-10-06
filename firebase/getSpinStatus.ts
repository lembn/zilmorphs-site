import { initFirebaseAdminSDK } from "./initAdmin";
import { AddressDoc } from "../interfaces";

export async function getSpinStatus(target: string) {
    const admin = initFirebaseAdminSDK();
    const docsRef = admin
        .firestore()
        .collection("addr")
        .doc(target)
        .collection("docs");
    const ref = docsRef.doc("status");
    const doc = await ref.get();
    if (!doc.exists) {
        const def: AddressDoc = {
            spinsClaimed: 0,
            spinsExecuted: 0,
            spinsOwned: 0,
        };
        await ref.create(def);
        return { data: def, ref, docsRef };
    }
    return { data: doc.data() as AddressDoc, ref, docsRef };
}
