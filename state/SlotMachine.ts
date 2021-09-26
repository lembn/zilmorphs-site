import { makeAutoObservable } from "mobx";
import Big from "big.js";
import { randomBytes } from "crypto";

/**
 * A slot machine that has the same expected take value
 * for each of its win tiers
 */
export class SlotMachine {
    private winTiersLength: number;
    winTierAndChance: { win: Big; chance: Big }[] = [];
    private getWinChangeForWinTier(timesTicketPrice: number) {
        return new Big(1)
            .sub(this.percentageProfit)
            .div(this.winTiersLength)
            .mul(new Big(1).div(timesTicketPrice));
    }
    constructor(public winTiers: number[], public percentageProfit: number) {
        this.winTiersLength = winTiers.length;
        this.winTierAndChance = winTiers.map((w) => ({
            win: new Big(w),
            chance: this.getWinChangeForWinTier(w),
        }));
        this.winTierAndChance.map((i) =>
            console.log(
                `win ${i.win.toString()} chance ${i.chance
                    .mul(new Big(100))
                    .toFixed(3)}%`
            )
        );
        makeAutoObservable(this);
    }
    spin() {
        // 2^128-1
        const r = Math.random();
        console.log(r);
    }
}
