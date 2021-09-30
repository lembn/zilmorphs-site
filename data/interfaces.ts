/**
 * description
 * and the rarity percentage from 0 to 100
 */
interface RarityInfo {
    desc: string;
    percentage: number;
}

export interface ApiMorph {
    pic: string;
    num: string;
    data: {
        name: string;
        stats: Piece;
    };
    link: string;
}

/**
 * key is number idenityfying the zilmorph
 * stats from 0 to 100
 */
interface Piece {
    str: number;
    agi: number;
    int: number;
    special: RarityInfo[];
}

interface AllDict {
    [k: string]: {
        name: string;
        stats: Piece;
    };
}
