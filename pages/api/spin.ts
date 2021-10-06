import type { NextApiRequest, NextApiResponse } from "next";
import { SlotMachineSpinner } from "../../bind/SlotMachineSpinner";
import Big from "big.js";
import { ByStr20, Uint128 } from "boost-zil";
import { addressbook } from "../../data/addressbook";
import { initFirebaseAdminSDK } from "../../firebase/initAdmin";
import { AddressDoc } from "../../interfaces";
import { getSpinStatus } from "../../firebase/getSpinStatus";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const admin = initFirebaseAdminSDK();
        const target = new ByStr20(req.body.target).lowerCase();
        const { ref, data, docsRef } = await getSpinStatus(target);
        const morphStat = req.body.morphStat;
        const spinsExecuted = (data.spinsExecuted | 0) + 1;
        if (spinsExecuted > data.spinsOwned) {
            res.status(401).json({ message: "Run out of spins" });
            return;
        }
        const spinner = new SlotMachineSpinner(
            [2, 3, 7, 42],
            0,
            new Big(Uint128.zil("10").toSend()),
            addressbook.SLOT_MACHINE
        );
        const spin = spinner.spin(
            new ByStr20(target),
            morphStat,
            spinsExecuted,
            3000
        );

        const batch = admin.firestore().batch();
        batch.update(ref, {
            spinsExecuted,
        });

        batch.create(docsRef.doc(spinsExecuted.toString()), spin);
        await batch.commit();

        res.status(200).json(spin);
    } catch (e) {}
};
