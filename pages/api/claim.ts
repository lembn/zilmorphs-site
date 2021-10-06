import type { NextApiRequest, NextApiResponse } from "next";
import { ByStr20, List } from "boost-zil";
import { SlotMachine } from "../../bind/SlotMachine/build/bind";
import { noSignerResolvers } from "../../util/config";
import { getSpinStatus } from "../../firebase/getSpinStatus";
import { initFirebaseAdminSDK } from "../../firebase/initAdmin";
import { ThresholdJSON, Threshold } from "../../bind/SlotMachineSpinner";
import { Account } from "@zilliqa-js/account";
import { addressbook } from "../../data/addressbook";
import Long from "long";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const target = new ByStr20(req.body.target).lowerCase();
        const { ref, data, docsRef } = await getSpinStatus(target);
        // update the spins Claimed and SpinsOwned
        const sdk = SlotMachine(noSignerResolvers);

        const docs = await docsRef
            .where("spinNum", ">", data.spinsClaimed)
            .get();
        if (docs.docs.length == 0) {
            res.status(401).json({ message: "no spins to claim" });
            return;
        }
        const thresholds = docs.docs.map((d) => d.data() as ThresholdJSON);
        const adminAcc = new Account(process.env.ADMIN);
        const signed = Threshold.signBatchThresholdJSON(
            adminAcc,
            ...thresholds
        );
        const tx = sdk
            .calls(addressbook.SLOT_MACHINE)(Long.fromString("50000"))
            .ClaimSpins(
                new ByStr20(target),
                new List(signed.map((s) => s.data))
            )
            .toJSON();
        res.status(200).json({ tx });
        return;
    } catch (e) {
        console.error(e);
    }
    res.end();
};
