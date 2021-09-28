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

export const notifi = new Notifi();
