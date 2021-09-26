import { makeAutoObservable, runInAction } from "mobx";
import {
    getBuyParams,
    BNToDisp,
    BNToPrecision12,
    precision12ToBN,
    getSellInfo,
    getLiveBuyParams,
    getLiveSellInfo,
} from "../util/shared";
import { BN, Long } from "@zilliqa-js/util";
import { statsDisp } from "./StatsDisp";
import * as token from "../bind";
import { getImplementation } from "../util/config";
import { walletManager } from "../state/WalletManager";
import { Transaction } from "@zilliqa-js/account";

type State = "BUY" | "SELL";

class Buyer {
    lastTxLink: undefined | string;
    loading = false;
    state: State = "BUY";
    avgPrice: BN = new BN(0);
    private box1: BN = new BN(0);
    private box2: BN = new BN(0);

    get valid() {
        return this.box1.toNumber() != 0 && !this.loading;
    }

    get avgPriceDisp() {
        return BNToDisp(this.avgPrice);
    }

    get box1Disp() {
        return BNToPrecision12(this.box1);
    }
    get box2Disp() {
        return BNToPrecision12(this.box2);
    }
    get stateDisp() {
        return this.state == "BUY" ? "Buy" : "Sell";
    }

    toggleLoading() {
        this.loading = !this.loading;
    }

    async doTrade() {
        this.toggleLoading();
        try {
            const limit = Long.fromInt(20000);
            let res: [Transaction, string];
            if (this.state == "BUY") {
                const params = await getLiveBuyParams(
                    getImplementation(),
                    this.box1
                );
                res = await token._Buy(
                    getImplementation(),
                    limit,
                    params.zilAmt,
                    params.buyAmt
                );
                console.debug(res);
            } else {
                res = await token._Sell(getImplementation(), limit, this.box1);
                console.debug(res);
            }
            runInAction(() => {
                this.lastTxLink = res[1];
            });
        } catch (e) {
            alert(e);
        }
        this.toggleLoading();
    }

    updateBuy(s: string, updateAs?: State) {
        const state = updateAs ? updateAs : this.state;
        if (!statsDisp.totalSupply) {
            return;
        }
        if (parseInt(s) < 0) {
            return;
        }
        this.updateParams(s, state, statsDisp.totalSupply);
    }

    private updateParams(s: string, state: State, totalSupply: BN) {
        const amt = precision12ToBN(s);
        let avg;
        if (state == "BUY") {
            const res = getBuyParams(totalSupply, amt);
            avg = res.avgPriceInZil;
            this.box2 = res.zilAmt;
        } else {
            const res = getSellInfo(totalSupply, amt);
            avg = res.avgPriceInZil;
            this.box2 = res.zilAmt;
        }
        this.avgPrice = avg;
        this.box1 = amt;
    }

    toggleState() {
        const toSet = this.state == "BUY" ? "SELL" : "BUY";
        this.updateBuy(BNToPrecision12(this.box1), toSet);
        this.state = toSet;
    }

    constructor() {
        makeAutoObservable(this);
    }

    subscribe() {
        return statsDisp.onContractNewState((r) =>
            this.updateParams(
                BNToPrecision12(this.box1),
                this.state,
                r.totalSupply
            )
        );
    }
}

export const buyer = new Buyer();
