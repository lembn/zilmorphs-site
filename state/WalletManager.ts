import { BN, Zilliqa, normaliseAddress } from "@zilliqa-js/zilliqa";
import { makeAutoObservable, runInAction } from "mobx";
import {
    getBuyParams,
    BNToPrecision12,
    precision12ToBN,
    getSellInfo,
    getAccountBalance,
    getAccountZRC2Balance,
} from "../util/shared";
import { monitor } from "../util/ContractMonitor";

class WalletManager {
    connected: boolean = false;
    subscribed: boolean = false;
    private balance: BN = new BN(0);
    private katBalance: BN = new BN(0);
    get zil() {
        return BNToPrecision12(this.balance);
    }
    get zrc() {
        return BNToPrecision12(this.katBalance);
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
    private async update() {
        if (this.thereIsZilPay() && this.getZilPay().wallet.defaultAccount) {
            const addr = normaliseAddress(
                this.getZilPay().wallet.defaultAccount.base16
            );
            if (addr) {
                const balance = await getAccountBalance(addr);
                const katBalance = await getAccountZRC2Balance(monitor.a, addr);
                runInAction(() => {
                    this.balance = balance;
                    this.katBalance = katBalance;
                });
            }
        }
    }
    async aquireWallet() {
        if (this.thereIsZilPay()) {
            const connected = await this.getZilPay().wallet.connect();
            runInAction(() => {
                this.connected = connected;
            });
            console.debug({ connected });
            if (connected) {
                return window.zilPay as unknown as Zilliqa;
            } else {
                throw new Error("zilpay not connected");
            }
        }
        window.open("https://zilpay.io/");
        throw new Error("No zilpay");
    }
    subscribe() {
        this.update();
        return monitor.onNewContractTx(() => this.update());
    }
}

export const walletManager = new WalletManager();

export const getZil = async () => {
    return walletManager.aquireWallet();
};
