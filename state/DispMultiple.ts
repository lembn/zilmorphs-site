import { makeAutoObservable, runInAction } from "mobx";
import { ApiMorph } from "../data/interfaces";
import { getPower } from "./shared";

export class DispMultiple {
    morphs: ApiMorph[] = [];
    constructor() {
        makeAutoObservable(this);
    }

    get strongestMorph() {
        if (this.morphs.length == 0) {
            return { power: 0, name: "no morph", fullName: "" };
        }
        const m = this.morphs[0];
        return {
            power: (getPower(m) / 300) * 100,
            name: m.data.name,
            fullName: `#${m.num} ${m.data.name}`,
            morph: m,
        };
    }

    async get(...ids: string[]) {
        try {
            const res = await fetch("/api/morph/batch", {
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ ids: ["234", "2345"] }),
                method: "POST",
            });
            const data = (await res.json()) as ApiMorph[];
            data.sort((b, a) => getPower(a) - getPower(b));
            runInAction(() => {
                this.morphs = data;
            });
        } catch (e) {
            console.error(e);
        }
    }
}

export const multiple = new DispMultiple();
