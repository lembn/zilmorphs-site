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

export interface Attribute {
    trait_type: string;
    value: string;
    rarity: number;
}

export type ARKCompatibleMetadata = ApiMorph & {
    name: string;
    description: string;
    // image link
    image: string;
    id: string;
    // no 0x prefix hex hash
    hash: string;
    attributes: Attribute[];
    // same as id
    zilmorphId: number;
    // same as id
    bearId: number;
    // true 
    minted: boolean;
};

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
