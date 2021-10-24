import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import crypto from "crypto";

const writePath = resolve(__dirname, "./morphHash.ts");
const toWrite: { [key: string]: string } = {};

function hashBuffer(b: Buffer) {
    const hash = crypto.createHash("sha256");
    hash.update(b);
    return hash.digest("hex");
}

for (let x = 1; x < 8001; x++) {
    const pngPath = resolve(__dirname, `../public/morph/${x}.png`);
    const png = readFileSync(pngPath);
    const k = "" + x;
    toWrite[k] = hashBuffer(png);
}

const writeStr = `export const morphHash = ${JSON.stringify(
    toWrite,
    null,
    2
)}
`;

const res = {};
// sanity check
Object.values(toWrite).forEach((v) => void (res[v] = 1));

if (Object.keys(res).length != 8000) {
    throw new Error("oopsie");
}

writeFileSync(writePath, writeStr);
