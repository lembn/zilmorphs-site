import { getVersion } from "../util/config";
import { BN, Long } from "@zilliqa-js/util";
import { normaliseAddress } from "@zilliqa-js/zilliqa";
import { getContract, getMinGasPrice } from "../util/shared";
import { getZil } from "../state/WalletManager";
import { Transaction } from "@zilliqa-js/account";
import { getNetworkName } from "../util/config";

function txLink(t: Transaction) {
    //@ts-ignore
    const id = t.ID;
    return `https://viewblock.io/zilliqa/tx/0x${id}?network=${getNetworkName()}`;
}

export async function _Buy(
    a: string,
    gasLimit: Long,
    amount: BN,
    __buy_amt: BN
): Promise<[Transaction, string]> {
    const zil = await getZil();
    const gasPrice = await getMinGasPrice(zil);
    const contract = getContract(zil, a);
    const tx = await contract.call(
        "Buy",
        [
            {
                type: `Uint128`,
                vname: `buy_amt`,
                value: __buy_amt.toString(),
            },
        ],
        {
            version: getVersion(),
            amount: amount,
            gasPrice,
            gasLimit,
        }
    );
    return [tx, txLink(tx)];
}

export async function _Sell(
    a: string,
    gasLimit: Long,
    __sell_amt: BN
): Promise<[Transaction, string]> {
    const zil = await getZil();
    const gasPrice = await getMinGasPrice(zil);
    const contract = getContract(zil, a);
    const tx = await contract.call(
        "Sell",
        [
            {
                type: `Uint128`,
                vname: `sell_amt`,
                value: __sell_amt.toString(),
            },
        ],
        {
            version: getVersion(),
            amount: new BN(0),
            gasPrice,
            gasLimit,
        }
    );
    return [tx, txLink(tx)];
}

export async function _Transfer(
    a: string,
    gasLimit: Long,
    __to: string,
    __amount: BN
): Promise<[Transaction, string]> {
    const zil = await getZil();
    const gasPrice = await getMinGasPrice(zil);
    const contract = getContract(zil, a);
    const tx = await contract.call(
        "Transfer",
        [
            {
                type: `ByStr20`,
                vname: `to`,
                value: normaliseAddress(__to),
            },
            {
                type: `Uint128`,
                vname: `amount`,
                value: __amount.toString(),
            },
        ],
        {
            version: getVersion(),
            amount: new BN(0),
            gasPrice,
            gasLimit,
        }
    );
    return [tx, txLink(tx)];
}

export async function _TransferFrom(
    a: string,
    gasLimit: Long,
    __from: string,
    __to: string,
    __amount: BN
): Promise<[Transaction, string]> {
    const zil = await getZil();
    const gasPrice = await getMinGasPrice(zil);
    const contract = getContract(zil, a);
    const tx = await contract.call(
        "TransferFrom",
        [
            {
                type: `ByStr20`,
                vname: `from`,
                value: normaliseAddress(__from),
            },
            {
                type: `ByStr20`,
                vname: `to`,
                value: normaliseAddress(__to),
            },
            {
                type: `Uint128`,
                vname: `amount`,
                value: __amount.toString(),
            },
        ],
        {
            version: getVersion(),
            amount: new BN(0),
            gasPrice,
            gasLimit,
        }
    );
    return [tx, txLink(tx)];
}
