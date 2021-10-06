import type { NextApiRequest, NextApiResponse } from "next";
import { ByStr20 } from "boost-zil";
import { addressbook } from "../../data/addressbook";
import { initFirebaseAdminSDK } from "../../firebase/initAdmin";
import { AddressDoc } from "../../interfaces";
import { SlotMachine } from "../../bind/SlotMachine/build/bind";
import { noSignerResolvers } from "../../util/config";
import { getSpinStatus } from "../../firebase/getSpinStatus";

function sanitize(s: unknown) {
    if (typeof s == "undefined") {
        return 0;
    }
    return parseInt(s as string);
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const target = new ByStr20(req.body.target).lowerCase();
        const { ref } = await getSpinStatus(target);
        // update the spins Claimed and SpinsOwned
        const sdk = SlotMachine(noSignerResolvers);

        const state = await sdk
            .state(
                {
                    players_claimed: { [target]: "*" },
                    players_spins: { [target]: "*" },
                },
                "false"
            )
            .get(addressbook.SLOT_MACHINE);
        const sanitized_claim = sanitize(state[0].players_claimed[target]);
        const sanitized_spins = sanitize(state[0].players_spins[target]);
        const up: Partial<AddressDoc> = {
            spinsClaimed: sanitized_claim,
            spinsOwned: sanitized_spins,
        };
        await ref.update(up);
    } catch (e) {
        console.error(e);
    }
    res.end();
};
