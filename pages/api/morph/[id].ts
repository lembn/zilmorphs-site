import type { NextApiRequest, NextApiResponse } from "next";
import { morphData } from "../../../data/morphData";
import { morphAttributes } from "../../../data/morphAttributes";
import { morphHash } from "../../../data/morphHash";
import { ARKCompatibleMetadata } from "../../../data/interfaces";

const description = `Zilmorphs is a collection of 8,000 machine learning generated creatures on the Zilliqa blockchain. Zilmorphs were created to celebrate the creation of the Zilliqa bridge and can only be bought with Zilliqa bridge assets. Find out more at: https://zilmorphs.com/dapp`;
const name = "Zilmorphs NFT";

export default (req: NextApiRequest, res: NextApiResponse) => {
    let { id } = req.query;
    if (typeof id != "string") {
        id = id.join("");
    }
    const numId = parseInt(id);
    if (numId < 1 || numId > 8000) {
        res.status(400).json({ message: "Allowed range is 1 to 8000" });
        return;
    }
    const image = `https://storage.googleapis.com/morphs/${id}.png`;
    const zilmorphId = parseInt(id);
    const re: ARKCompatibleMetadata = {
        num: id,
        data: morphData[id],
        pic: `/morph/${id}.png`,
        link: image,
        image,
        bearId: zilmorphId,
        zilmorphId,
        name,
        description,
        id,
        attributes: morphAttributes[id],
        hash: morphHash[id],
        minted: true,
    };
    res.status(200).json(re);
};
