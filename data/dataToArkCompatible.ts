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

// const traitTypeToValue = {
//     Intelligence: {
//         top: "Genius",
//         avg: "Average",
//         bottom: "Dumb",
//     },
//     Strength: { top: "Tank", avg: "Average", bottom: "Weakling" },
//     Agility: { top: "Swift", avg: "Average", bottom: "Sluggish" },
// };

/**
 * 0 to 0.25
 * < 5 I
 * < 15 II
 * < 25 III
 */
function getTier(rarity: number) {
    if (rarity < 0.05) {
        return "I";
    }
    if (rarity < 0.15) {
        return "II";
    }
    if (rarity <= 0.25) {
        return "III";
    }
    throw new Error("oops" + rarity);
}

function getTierOfAbility(stat: number) {
    return Math.round((stat - (stat % 10)) / 10) + 1;
}

const attributes = Object.fromEntries(
    Object.entries(morphData).map(([id, data]) => {
        const stats = data.stats;
        const specials = stats.special.map((s) => {
            const statTrait = s.desc.match(matchStatTrait);
            if (statTrait) {
                const value = statTrait[0];
                if (typeof value == "undefined") {
                    throw new Error("err" + statTrait);
                }
                const trait_type =
                    value == "Genius" || value == "Dumb"
                        ? "Intelligence"
                        : value == "Tank" || value == "Weakling"
                        ? "Strength"
                        : "Agility";
                const rarity = getFraction(s.percentage);
                const attr: Attribute = {
                    trait_type,
                    rarity,
                    value: value + " " + getTier(rarity),
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
                value: `Str ${getTierOfAbility(stats.str)}`,
            },
            {
                trait_type: "Agility",
                rarity: getStat(stats.agi),
                value: `Agi ${getTierOfAbility(stats.agi)}`,
            },
            {
                trait_type: "Intelligence",
                rarity: getStat(stats.int),
                value: `Int ${getTierOfAbility(stats.int)}`,
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
