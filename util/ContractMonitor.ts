import { normaliseAddress } from "@zilliqa-js/crypto";
import { ZilliqaWs } from "./ZilliqaWs";
import { v4 } from "uuid";
import { getWS } from "../util/config";

export class ContractMonitor {
    a: string;
    private url: string;
    private client: ZilliqaWs | undefined;
    private onUpdateCallbacks: { [key: string]: (a: string) => void } = {};
    constructor(a: string, url: string) {
        this.a = normaliseAddress(a);
        this.url = url;
    }
    onNewContractTx(f: (a: string) => void) {
        const id = v4();
        this.onUpdateCallbacks[id] = f;
        return () => {
            delete this.onUpdateCallbacks[id];
        };
    }
    subscribe() {
        this.client = new ZilliqaWs();
        this.client.init(this.url, {
            query: "TxnLog",
            addresses: [this.a.toLowerCase()],
            onMessage: (m) => {
                if (m.value) {
                    Object.entries(this.onUpdateCallbacks).forEach(([k, f]) =>
                        f(this.a)
                    );
                }
            },
        });
        return () => {
            this.client.kill();
        };
    }
}

export const monitor = new ContractMonitor(getImplementation(), getWS());
