import { makeAutoObservable, runInAction } from "mobx";
import { BNToPrecision12, precision12ToBN } from "../util/shared";
import { BN, Long, validation } from "@zilliqa-js/util";
import * as token from "../bind";
import { getImplementation } from "../util/config";
import { toBech32Address, normaliseAddress } from "@zilliqa-js/crypto";

function isAddress(s: string) {
    try {
        if (validation.isAddress(normaliseAddress(s))) {
            return true;
        }
    } catch (e) {}
    return false;
}

class Sender {
    lastTxLink: undefined | string;
    loading = false;
    private box1: BN = new BN(0);
    private box2: string = "";
    get box1Disp() {
        return BNToPrecision12(this.box1);
    }
    get box2Disp() {
        if (isAddress(this.box2)) {
            if (validation.isBech32(this.box2)) {
                return this.box2;
            }
            return toBech32Address(this.box2);
        }
        return this.box2;
    }
    get noAddress() {
        return this.box2 == "";
    }
    updateBox1(s: string) {
        if (parseInt(s) < 0) {
            return;
        }
        this.box1 = precision12ToBN(s);
    }
    updateBox2(s: string) {
        this.box2 = s;
    }
    get isAddressValid() {
        return isAddress(this.box2);
    }

    get valid() {
        return (
            this.box1.toNumber() != 0 && !this.loading && isAddress(this.box2)
        );
    }
    toggleLoading() {
        this.loading = !this.loading;
    }

    async doSend() {
        this.toggleLoading();
        try {
            const limit = Long.fromInt(20000);
            const res = await token._Transfer(
                getImplementation(),
                limit,
                this.box2,
                this.box1
            );
            console.debug(res);
            runInAction(() => {
                this.lastTxLink = res[1];
            });
        } catch (e) {
            alert(e);
        }
        this.toggleLoading();
    }

    constructor() {
        makeAutoObservable(this);
    }
}

export const sender = new Sender();
