import { w3cwebsocket } from "websocket";
import { NewBlock, EventLog, TxnLog } from "./interfaces";

type Subscription = NewBlock | EventLog | TxnLog;

export class ZilliqaWs {
    private client: w3cwebsocket | undefined = undefined;
    private subscription: Subscription[] = [];

    private addSubscription(s: Subscription) {
        this.subscription.push(s);
    }

    private getClient() {
        if (this.client) {
            return this.client;
        }
        throw new Error("Client not initialized");
    }

    kill() {
        this.getClient().close();
    }

    init(url: string, subscription: Subscription) {
        this.client = new w3cwebsocket(url);
        this.addSubscription(subscription);
        this.getClient().onerror = () => console.log("Connection Error");
        this.getClient().onclose = () =>
            console.log("echo-protocol Client Closed");
        this.getClient().onopen = () => {
            console.log("WebSocket Client Connected");
            this.getClient().send(JSON.stringify(subscription));
        };
        this.getClient().onmessage = (e) => {
            if (typeof e.data === "string") {
                try {
                    const data = JSON.parse(e.data);
                    if (data.type == "Notification") {
                        const values = data.values as Subscription[];
                        values.forEach((v) => {
                            if (v.query == "TxnLog") {
                                const s = subscription as TxnLog;
                                if (s.onMessage) {
                                    s.onMessage(v);
                                }
                            } else if (v.query == "NewBlock") {
                                console.log(JSON.stringify(v, null, 2));
                            }
                        });
                    }
                } catch (er) {
                    console.error(e.data);
                }
            }
        };
    }
}
