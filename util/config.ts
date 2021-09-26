import { bytes } from "@zilliqa-js/util";
import { Zilliqa } from "@zilliqa-js/zilliqa";

export const tokenDetails = {
    symbol: "KAT",
    emoji: "🐱",
    dispName: "🐱 KAT",
    happy: "😻",
    sad: "😿"
};

type Nets = "TESTNET" | "MAINNET";
const CUR_NETWORK: Nets = process.env
    .NEXT_PUBLIC_CUR_NETWORK as unknown as Nets;
const nodes: { [key in Nets]: string } = {
    TESTNET: "https://dev-api.zilliqa.com",
    MAINNET: "https://api.zilliqa.com",
};
const implementation: { [key in Nets]: string } = {
    TESTNET: "zil12gaexft4xlkhyt9zg4k7jcy3lx4guafnrx4s0v",
    MAINNET: "",
};
const ws: { [key in Nets]: string } = {
    TESTNET: "wss://dev-ws.zilliqa.com",
    MAINNET: "",
};
const version: { [key in Nets]: number } = {
    TESTNET: bytes.pack(333, 1),
    MAINNET: bytes.pack(1, 1),
};
const networkName: { [key in Nets]: "testnet" | "mainnet" } = {
    TESTNET: "testnet",
    MAINNET: "mainnet",
};
export function getWS() {
    return ws[CUR_NETWORK];
}
export function getImplementation() {
    return implementation[CUR_NETWORK];
}
export function getNetworkName(): "testnet" | "mainnet" {
    return networkName[CUR_NETWORK];
}
export function getVersion() {
    return version[CUR_NETWORK];
}
export function getNode() {
    return nodes[CUR_NETWORK];
}

export function getNoSignerZil() {
    return new Zilliqa(getNode());
}
export function getLink() {
    return `https://viewblock.io/zilliqa/address/${getImplementation()}?network=${getNetworkName()}`;
}
