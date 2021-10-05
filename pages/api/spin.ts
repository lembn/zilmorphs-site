import type { NextApiRequest, NextApiResponse } from "next";
import { SlotMachineSpinner } from "../../bind/SlotMachineSpinner";
import Big from "big.js";
import { ByStr20, Uint128 } from "boost-zil";
import { addressbook } from "../../data/addressbook";

export default (req: NextApiRequest, res: NextApiResponse) => {
    const target = req.body.target;
    const morphStat = req.body.morphStat;
    const spinner = new SlotMachineSpinner(
        [2, 3, 7, 42],
        0,
        new Big(Uint128.zil("10").toSend()),
        addressbook.SLOT_MACHINE
    );
    const spin = spinner.spin(new ByStr20(target), morphStat, 0, 3000);
    res.status(200).json(spin);
};
