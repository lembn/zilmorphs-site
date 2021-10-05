import Big from "big.js";
import { makeAutoObservable } from "mobx";

class Notifi {
    visible: boolean = false;
    anchor = "";
    text = "";
    color = "black";
    anchorLabel = "";

    setVisible(b: boolean) {
        this.visible = b;
    }

    constructor() {
        makeAutoObservable(this);
    }

    show(t: string, c = "black", anchor = "", anchorLabel = "") {
        this.text = t;
        this.visible = true;
        this.color = c;
        this.anchor = anchor;
        this.anchorLabel = anchorLabel;
        setTimeout(() => this.setVisible(false), 8000);
    }
}

class SpinResult {
    visible: boolean = false;
    win = "";
    bonus = "";
    won: boolean;

    setVisible(b: boolean) {
        this.visible = b;
    }

    constructor() {
        makeAutoObservable(this);
    }

    show(winAmt: string, morphBonus: string) {
        const won = winAmt != "0";
        this.won = won;
        if (won) {
            this.win = new Big(winAmt).div(new Big(10).pow(12)).toFixed(2);
            this.bonus = new Big(morphBonus)
                .div(new Big(10).pow(12))
                .toFixed(2);
        }
        this.visible = true;
        setTimeout(() => this.setVisible(false), 1000);
    }
}

export const notifi = new Notifi();
export const spinResult = new SpinResult();
