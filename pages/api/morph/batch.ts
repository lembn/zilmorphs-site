import type { NextApiRequest, NextApiResponse } from "next";
import { morphData } from "../../../data/morphData";
import { ApiMorph } from "../../../data/interfaces";

export default (req: NextApiRequest, res: NextApiResponse) => {
    let { ids } = req.body;
    const re: ApiMorph[] = ids.map((id: string) => ({
        num: id,
        data: morphData[id],
        pic: `/morph/${id}.png`,
    }));
    res.status(200).json(re);
};
