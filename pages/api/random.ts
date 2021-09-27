import type { NextApiRequest, NextApiResponse } from "next";
import { morphData } from "../../data/morphData";
import { ApiMorph } from "../../data/interfaces";

function random() {
    return Math.floor(Math.random() * 8000).toString();
}

export default (req: NextApiRequest, res: NextApiResponse) => {
    const num = random();
    const re: ApiMorph = { num, data: morphData[num], pic: `/morph/${num}.png` };
    res.status(200).json(re);
};
