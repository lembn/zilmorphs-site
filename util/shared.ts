import { BN, Zilliqa, normaliseAddress } from "@zilliqa-js/zilliqa";
import type { RPCResponse } from "@zilliqa-js/core";
import { Value } from "./interfaces";
import { getNoSignerZil, getNetworkName } from "./config";
import { Contract } from "@zilliqa-js/contract";
import { TxParams, Transaction } from "@zilliqa-js/account";

const precision12 = new BN(1000000000000);
const precision9 = new BN(1000000000);
const two = new BN(2);

function getAvgPriceInZil(zilAmt: BN, tokenAmt: BN) {
    const numberOfTokensPrecision12 =
        tokenAmt.toNumber() / precision12.toNumber();
    const avgPriceInZil = zilAmt.toNumber() / numberOfTokensPrecision12;
    return new BN(avgPriceInZil);
}

export function BNToDisp(b: BN) {
    const trail = b.mod(precision9);
    const rest = b.sub(trail).div(precision12);
    const restString = rest.toString();
    if (trail.gt(new BN(0))) {
        let tr = trail.sub(precision9).toString();
        while (tr.length < 3) {
            tr = "0" + tr;
        }
        return `${restString}.${tr}`;
    }
    return `${restString}.000`;
}

export function BNToPrecision12(b: BN) {
    const trail = b.mod(precision12);
    const rest = b.sub(trail).div(precision12);
    return `${rest.toString()}`;
}
export function precision12ToBN(p: string) {
    return new BN(p).mul(precision12);
}

const sleep = async (mil: number) =>
    new Promise<void>((res, rej) => setTimeout(() => res(), mil));

async function retryLoop(
    maxRetries: number,
    intervalMs: number,
    func: () => Promise<RPCResponse<Value[], any>>
): Promise<[unknown, any]> {
    let err = {};
    for (let x = 0; x < maxRetries; x++) {
        await sleep(x * intervalMs);
        const temp = await func();
        if (temp.result) {
            return [temp.result, temp.error];
        }
        err = temp.error;
    }
    return [undefined, err];
}

export function getBuyParams(
    totalSupply: BN,
    buyAmt: BN
): {
    buyAmt: BN;
    zilAmt: BN;
    avgPriceInZil: BN;
    print: () => void;
} {
    // buyAmt(totalSupply + buyAmt/2)
    const i1 = buyAmt;
    const i2 = totalSupply.add(buyAmt.div(two));
    const zilAmt = i1.mul(i2).div(precision12);
    const avgPriceInZil = getAvgPriceInZil(zilAmt, buyAmt);
    return {
        buyAmt,
        zilAmt,
        avgPriceInZil,
        print: () =>
            console.log({
                buyAmt: buyAmt.toString(),
                zilAmt: zilAmt.toString(),
                avgPriceInZil: avgPriceInZil.toString(),
            }),
    };
}

export function getSellInfo(
    totalSupply: BN,
    sellAmt: BN
): {
    sellAmt: BN;
    zilAmt: BN;
    avgPriceInZil: BN;
    print: () => void;
} {
    // sellAmt(totalSupply - sellAmt/2)
    const i1 = sellAmt;
    const i2 = totalSupply.sub(sellAmt.div(two));
    const zilAmt = i1.mul(i2).div(precision12);
    const avgPriceInZil = getAvgPriceInZil(zilAmt, sellAmt);
    return {
        sellAmt,
        zilAmt,
        avgPriceInZil,
        print: () =>
            console.log({
                buyAmt: sellAmt.toString(),
                zilAmt: zilAmt.toString(),
                avgPriceInZil: avgPriceInZil.toString(),
            }),
    };
}

export async function getLiveSellInfo(a: string, sellAmt: BN) {
    const t = await getTotalSupply(a);
    return getSellInfo(t, sellAmt);
}

export async function getLiveBuyParams(a: string, buyAmt: BN) {
    const t = await getTotalSupply(a);
    return getBuyParams(t, buyAmt);
}

async function getContractSubState(
    a: string,
    key: string,
    maxRetries = 6,
    intervalMs = 750
): Promise<{ [key: string]: unknown }> {
    const zil = getNoSignerZil();
    const address = normaliseAddress(a);
    const err = (s: string, e: string) =>
        new Error(`There was an issue getting contract ${s} state, ${e}`);
    const [state, errState] = (await retryLoop(maxRetries, intervalMs, () =>
        zil.blockchain.getSmartContractSubState(address, key)
    )) as unknown as [{ _balance: string; [key: string]: any }, any];
    if (!state) {
        throw err("mutable", JSON.stringify(errState));
    }
    return state;
}

export async function getTotalSupply(a: string) {
    const addr = normaliseAddress(a);
    const res = await getContractSubState(addr, "total_supply");
    return new BN(res["total_supply"] as string);
}
export async function getBalance(a: string) {
    const addr = normaliseAddress(a);
    const res = await getContractSubState(addr, "_balance");
    return new BN(res["_balance"] as string);
}

export function getStats(
    totalSupply: BN,
    _balance: BN
): {
    avgTokenPrice: BN;
    marketCapZil: BN;
    totalSupply: BN;
    print: () => void;
} {
    const avgTokenPrice = getAvgPriceInZil(_balance, totalSupply);
    const marketCapZil = _balance;
    return {
        avgTokenPrice,
        marketCapZil,
        totalSupply,
        print: () =>
            console.log({
                totalSupply: totalSupply.toString(),
                avgTokenPrice: avgTokenPrice.toString(),
                marketCapZil: marketCapZil.toString(),
            }),
    };
}

export function getContract(
    zil: Zilliqa,
    a: string
): Contract & {
    call: (
        transition: string,
        args: Value[],
        params: Pick<
            TxParams,
            "version" | "amount" | "gasPrice" | "gasLimit" | "nonce" | "pubKey"
        >,
        attempts?: number,
        interval?: number,
        toDs?: boolean
    ) => ReturnType<Contract["call"]>;
} {
    const address = normaliseAddress(a);
    //@ts-ignore
    return zil.contracts.at(address);
}

export async function getMinGasPrice(zil: Zilliqa) {
    const minGas = await zil.blockchain.getMinimumGasPrice();
    if (!minGas.result) {
        throw "no gas price";
    }
    return new BN(minGas.result);
}

export async function getAccountBalance(addr: string) {
    const zil = getNoSignerZil();
    const res = await zil.blockchain.getBalance(normaliseAddress(addr));
    if (!res.result) {
        throw "no balance price";
    }
    return new BN(res.result.balance);
}

export function newContract(
    zil: Zilliqa,
    code: string,
    init: Value[]
): Contract {
    //@ts-ignore
    return zil.contracts.new(code, init);
}

export async function getAccountZRC2Balance(a: string, account: string) {
    const addr = normaliseAddress(a);
    const res = await getContractSubState(addr, "balances");
    const accBalance = Object.fromEntries(
        Object.entries(res["balances"]).map(([k, v]) => [k.toLowerCase(), v])
    )[account.toLowerCase()];
    if (accBalance) {
        return new BN(accBalance);
    }
    return new BN(0);
}
