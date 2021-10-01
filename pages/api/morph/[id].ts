import type { NextApiRequest, NextApiResponse } from "next";
import { morphData } from "../../../data/morphData";
import { ApiMorph } from "../../../data/interfaces";

export default (req: NextApiRequest, res: NextApiResponse) => {
    let { id } = req.query;
    if (typeof id != "string") {
        id = id.join("");
    }
    const re: ApiMorph = {
        num: id,
        data: morphData[id],
        pic: `/morph/${id}.png`,
        link: `https://zilmorphs.com/morph/${id}.png`,
    };
    res.status(200).json(re);
};
