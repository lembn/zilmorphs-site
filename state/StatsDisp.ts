import { makeAutoObservable, runInAction } from "mobx";
import { monitor } from "../util/ContractMonitor";
import { getBalance, getTotalSupply, getStats, BNToDisp } from "../util/shared";
import { BN } from "@zilliqa-js/util";
import { v4 } from "uuid";

type CallbackFn = (a: {
    avgTokenPrice: BN;
    marketCapZil: BN;
    totalSupply: BN;
}) => void;

class StatsDisp {
    totalSupply: BN = new BN(0);
    private avgTokenPrice: BN = new BN(0);
    private marketCapZil: BN = new BN(0);
    private onUpdateCallbacks: {
        [key: string]: CallbackFn;
    } = {};
    onContractNewState(f: CallbackFn) {
        const id = v4();
        this.onUpdateCallbacks[id] = f;
        return () => {
            delete this.onUpdateCallbacks[id];
        };
    }
    get total() {
        return BNToDisp(this.totalSupply);
    }
    get avg() {
        return BNToDisp(this.avgTokenPrice);
    }
    get cap() {
        return BNToDisp(this.marketCapZil);
    }
    constructor() {
        makeAutoObservable(this);
    }
    private async update() {
        const b = await getBalance(monitor.a);
        const t = await getTotalSupply(monitor.a);
        const r = getStats(t, b);
        runInAction(() => {
            this.avgTokenPrice = r.avgTokenPrice;
            this.marketCapZil = r.marketCapZil;
            this.totalSupply = r.totalSupply;
        });
        Object.entries(this.onUpdateCallbacks).forEach(([k, f]) => f(r));
    }
    subscribe() {
        this.update();
        return monitor.onNewContractTx(() => this.update());
    }
}

export const statsDisp = new StatsDisp();
