import { ApiMorph } from "../data/interfaces";

export function getPower(m: ApiMorph) {
    return m.data.stats.agi + m.data.stats.int + m.data.stats.str;
}