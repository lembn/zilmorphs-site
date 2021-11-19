import { BN, Zilliqa, normaliseAddress } from "@zilliqa-js/zilliqa";
import { makeAutoObservable, runInAction } from "mobx";
// import { monitor } from "../util/ContractMonitor";
import { ByStr20, partialState } from "boost-zil";
import { addressbook } from "../data/addressbook";
import { getNoSignerZil } from "../util/config";
import { Big } from "big.js";
import { FungibleToken } from "../bind/FungibleToken/build/bind";
import { SlotMachine } from "../bind/SlotMachine/build/bind";
import { Zilmorphs } from "../bind/Zilmorphs/build/bind";
import { getNetworkName, getVersion } from "../util/config";

function BNtoDisp(b: BN, decimals: number, precision = 6): string {
    const base = new Big(b.toString()).div(new Big(10).pow(decimals));
    return base.toFixed(precision);
}

function BNtoUSDprice(b: BN, usdP: Big, decimals: number, precision = 3) {
    const base = new Big(b.toString()).div(new Big(10).pow(decimals));
    return base.mul(usdP).toFixed(precision);
}

const tokens = [addressbook.ethTOKEN, addressbook.btcTOKEN, addressbook.usdTOKEN];

const sellers = [addressbook.ETH_SELLER, addressbook.BTC_SELLER, addressbook.USDT_SELLER];

async function getPrice(currency: string): Promise<Big> {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${currency}&vs_currencies=usd`);

    const rates = await res.json();
    return new Big(rates[currency].usd);
}

class WalletManager {
    unclaimedSpins: number;
    addr: string;
    connected: boolean = false;
    private zeth: BN = new BN(0);
    private zwbtc: BN = new BN(0);
    private zusdt: BN = new BN(0);
    inUSDETH = "0";
    inUSDBTC = "0";
    inUSDUSD = "0";
    private zethPrice: BN = new BN(0);
    private zwbtcPrice: BN = new BN(0);
    private zusdtPrice: BN = new BN(0);
    owned: string[] = [];
    saleOpen: boolean = true;

    typeToAddress(t: "zETH" | "zWBTC" | "zUSDT") {
        if (t == "zETH") {
            return { token: tokens[0], seller: sellers[0], decimals: 18 };
        }
        if (t == "zWBTC") {
            return { token: tokens[1], seller: sellers[1], decimals: 8 };
        }
        return { token: tokens[2], seller: sellers[2], decimals: 6 };
    }

    typeToBalance(t: "zETH" | "zWBTC" | "zUSDT") {
        if (t == "zETH") {
            return this.zethB;
        }
        if (t == "zUSDT") {
            return this.zusdtB;
        }
        return this.zwbtcB;
    }

    typeToPrice(t: "zETH" | "zWBTC" | "zUSDT") {
        if (t == "zETH") {
            return this.zethP;
        }
        if (t == "zUSDT") {
            return this.zusdtP;
        }
        return this.zwbtcP;
    }
    get zethB() {
        return BNtoDisp(this.zeth, 18);
    }
    get zwbtcB() {
        return BNtoDisp(this.zwbtc, 8);
    }
    get zusdtB() {
        return BNtoDisp(this.zusdt, 6);
    }

    get zethP() {
        return BNtoDisp(this.zethPrice, 18);
    }
    get zwbtcP() {
        return BNtoDisp(this.zwbtcPrice, 8);
    }
    get zusdtP() {
        return BNtoDisp(this.zusdtPrice, 6);
    }

    constructor() {
        makeAutoObservable(this);
    }

    private thereIsZilPay() {
        if (typeof window != "undefined") {
            if (typeof window.zilPay != "undefined") {
                return true;
            }
        }
        return false;
    }
    private getZilPay() {
        if (this.thereIsZilPay()) {
            return window.zilPay;
        }
        throw new Error("no zilpay");
    }

    async updatePrices() {
        //@ts-expect-error
        const states = await partialState(async () => getNoSignerZil())(
            ...sellers.map((t) => ({
                contractAddress: t,
                includeInit: "false" as "false",
                query: {
                    nft_price: "*" as "*",
                },
            })),
            {
                contractAddress: addressbook.BTC_SELLER,
                includeInit: "false",
                //@ts-expect-error
                query: { sale_active: "*" },
            }
        );
        // console.log(states);
        //@ts-expect-error
        const prices = states.splice(0, 3).map((s) => new BN(s.nft_price));
        // the btc seller sale active
        const btcseller = states.shift();
        // console.log(btcseller);
        //@ts-expect-error
        const saleOpen = btcseller.sale_active.constructor != "False";
        const usdP = { eth: new Big(0), btc: new Big(0), usdt: new Big(1) };
        usdP.eth = await getPrice("ethereum");
        usdP.btc = await getPrice("bitcoin");

        runInAction(() => {
            this.zethPrice = prices[0];
            this.zwbtcPrice = prices[1];
            this.zusdtPrice = prices[2];
            this.saleOpen = saleOpen;
            const ethusd = BNtoUSDprice(prices[0], usdP.eth, 18);
            const btcusd = BNtoUSDprice(prices[1], usdP.btc, 8);
            const usdusd = BNtoUSDprice(prices[2], usdP.usdt, 6);

            this.inUSDETH = ethusd;
            this.inUSDBTC = btcusd;
            this.inUSDUSD = usdusd;
        });
    }
    async update() {
        if (this.thereIsZilPay() && this.getZilPay().wallet.defaultAccount) {
            const addr = normaliseAddress(this.getZilPay().wallet.defaultAccount.base16).toLowerCase();
            if (addr) {
                //@ts-expect-error
                const states = await partialState(async () => getNoSignerZil())(
                    ...tokens.map((t) => ({
                        contractAddress: t,
                        includeInit: "false" as "false",
                        query: {
                            balances: { [addr]: "*" as "*" },
                        },
                    })),
                    {
                        contractAddress: addressbook.ZILMORPHS_ADDRESS,
                        includeInit: "false",
                        //@ts-expect-error
                        query: { token_owners: "*" },
                    },
                    {
                        contractAddress: addressbook.SLOT_MACHINE,
                        includeInit: "false",
                        query: {
                            players_claimed: { [addr]: "*" },
                            players_spins: { [addr]: "*" },
                        },
                    }
                );
                const stat = states.splice(0, 3) as unknown as {
                    balances: { [k: string]: undefined | string };
                }[];
                const processed = stat.map((s) =>
                    typeof s.balances[addr] == "undefined" ? new BN(0) : new BN(s.balances[addr])
                );
                // console.log(processed);
                // the owners of token
                // console.log(states);
                const token_ids = Object.entries(states.shift().token_owners)
                    .filter(([id, address]) => ByStr20.areEqual(address, addr))
                    .map(([id, address]) => id);

                // states
                const slotMachine = states.shift() as unknown as {
                    players_claimed: { [k: string]: string };
                    players_spins: { [k: string]: string };
                };

                const claimed = parseInt(slotMachine.players_claimed[addr] || "0");
                const spins = parseInt(slotMachine.players_spins[addr] || "0");

                const unclaimed = spins - claimed;

                runInAction(() => {
                    this.zeth = processed[0];
                    this.zwbtc = processed[1];
                    this.zusdt = processed[2];
                    this.owned = token_ids;
                    this.unclaimedSpins = unclaimed;
                    this.addr = addr;
                });
            }
        }
    }
    async aquireWallet(silent?: boolean, noUpdate?: boolean) {
        if (this.thereIsZilPay()) {
            const connected = await this.getZilPay().wallet.connect();
            runInAction(() => {
                this.connected = connected;
            });
            console.debug({ connected });
            if (connected) {
                if (!noUpdate) {
                    this.updatePrices();
                    this.update();
                }
                return window.zilPay as unknown as Zilliqa;
            } else {
                throw new Error("zilpay not connected");
            }
        }
        if (!silent) {
            // window.open("https://zilpay.io/");
            throw new Error("No zilpay");
        }
    }
    async silentConnect() {
        try {
            await this.aquireWallet(true);
        } catch (e) {}
    }
    // subscribe() {
    //     this.update();
    //     return monitor.onNewContractTx(() => this.update());
    // }
}

const resolvers = {
    getNetworkName,
    getVersion,
    getZil: async (signer) => {
        if (signer) {
            const zil = await walletManager.aquireWallet();
            return { zil, teardown: async () => {} };
        } else {
            return { zil: getNoSignerZil(), teardown: async () => {} };
        }
    },
};

export var tokenSdk = FungibleToken(resolvers);
export var zilmorphsSdk = Zilmorphs(resolvers);
export var slotMachineSdk = SlotMachine(resolvers);
export const walletManager = new WalletManager();

export const getZil = async (signer: boolean) => {
    return { zil: walletManager.aquireWallet(), teardown: async () => {} };
};
