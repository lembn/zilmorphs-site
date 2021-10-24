import { morphData } from "./morphData";
import { writeFileSync } from "fs";
import { resolve } from "path";
import { Attribute } from "./interfaces";

const nameRarity = parseFloat((1 / 8000).toFixed(6));

function getFraction(num: number, precision = 3) {
    return parseFloat((num / 100).toFixed(precision));
}

function getStat(num: number) {
    return parseFloat((1 - getFraction(num)).toFixed(3));
}

const matchStatTrait = /(Genius)|(Dumb)|(Tank)|(Weakling)|(Sluggish)|(Swift)/;
const matchRest = /(Simple)|(Crystal)/;

// const all = {
//     desc: "Genius. Top 17.647%",
//     desc: "Dumb. Bottom 10.607%",

//     desc: "Tank. Top 19.032%",
//     desc: "Weakling. Bottom 12.16%",

//     desc: "Sluggish. Bottom 23.062%",
//     desc: "Swift. Top 2.725%",

//     "Simple color palette. Has few colors."

//     "desc": "Crystal clear. Has pure white background.",
//     "percentage": 1.7500000000000002

//     "desc": "Simple color palette. Has few colors.",
//     "percentage": 0.675
// }

const attributes = Object.fromEntries(
    Object.entries(morphData).map(([id, data]) => {
        const stats = data.stats;
        const specials = stats.special.map((s) => {
            const statTrait = s.desc.match(matchStatTrait);
            if (statTrait) {
                const trait_type = statTrait[0];
                if (typeof trait_type == "undefined") {
                    throw new Error("err" + statTrait);
                }
                const toCutOff = `${trait_type}. `;
                const value = s.desc.substr(toCutOff.length);
                const attr: Attribute = {
                    trait_type: trait_type,
                    rarity: getFraction(s.percentage),
                    value,
                };
                return attr;
            }
            const rest = s.desc.match(matchRest);
            if (rest) {
                const attr: Attribute = {
                    trait_type: "Collector special",
                    rarity: getFraction(s.percentage),
                    value: s.desc,
                };
                return attr;
            }
            throw new Error(`didnt match ${s}`);
        });
        const morphAttr: Attribute[] = [
            {
                trait_type: "Name",
                rarity: nameRarity,
                value: data.name,
            },
            {
                trait_type: "Strength",
                rarity: getStat(stats.str),
                value: `${stats.str}`,
            },
            {
                trait_type: "Agility",
                rarity: getStat(stats.agi),
                value: `${stats.agi}`,
            },
            {
                trait_type: "Intelligence",
                rarity: getStat(stats.int),
                value: `${stats.int}`,
            },
            ...specials,
        ];

        return [id, morphAttr];
    })
);

const attrPath = resolve(__dirname, "./morphAttributes.ts");

const toWrite = `export const morphAttributes = ${JSON.stringify(
    attributes,
    null,
    2
)}
`;

writeFileSync(attrPath, toWrite);
