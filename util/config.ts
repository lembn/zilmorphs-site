import { bytes } from "@zilliqa-js/util";
import { Zilliqa } from "@zilliqa-js/zilliqa";

type Nets = "TESTNET" | "MAINNET";
const CUR_NETWORK: Nets = "MAINNET";
const nodes: { [key in Nets]: string } = {
    TESTNET: "https://dev-api.zilliqa.com",
    MAINNET: "https://api.zilliqa.com",
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
