import { observer } from "mobx-react-lite";
import { Box, Heading, Button, ResponsiveContext, TextInput, Anchor } from "grommet";
import { Medium } from "grommet-icons";
import { Para } from "../../components/Para";
import { useContext, useEffect } from "react";
import { Card } from "../../components/Card";
import { slotMachineSdk, walletManager } from "../../state/WalletManager";
import { multiple } from "../../state/DispMultiple";
import { makeAutoObservable, runInAction } from "mobx";
import { Long } from "@zilliqa-js/zilliqa";
import { addressbook } from "../../data/addressbook";
import { notifi } from "../../state/Notification";
import { ByStr20, Uint128 } from "boost-zil";
import { AddressDoc } from "../../interfaces";
import Big from "big.js";
import { onSnapshot, getFirestore, collection, doc, orderBy, query, where } from "@firebase/firestore";
import { getApp } from "firebase/app";
import { ThresholdJSON } from "../../bind/SlotMachineSpinner";

function spinToText(s: ThresholdJSON) {
    const base = `Spin #${s.spinNum} `;
    if (s.winAmt != "0") {
        return base + `🤑 Won: ${new Big(s.winAmt).div(new Big(10).pow(12)).toFixed(2)} ZIL`;
    }
    return base + `👻 nothing :(`;
}

class BuyerAndClaimer {
    sending = false;
    spinning = false;
    spins: number = 1;
    doc: AddressDoc = { spinsClaimed: 9999999, spinsExecuted: 0, spinsOwned: 0 };
    newestSpins: ThresholdJSON[] = [];

    get dispSpins() {
        return this.spins.toString();
    }

    setSpins(s: string) {
        this.spins = parseInt(s);
    }

    constructor() {
        makeAutoObservable(this);
    }

    async buySpins() {
        try {
            if (this.spins == 0) {
                throw new Error("Can't buy 0 spins");
            }
            runInAction(() => {
                this.sending = true;
            });
            const result = await slotMachineSdk
                .calls(addressbook.SLOT_MACHINE)(Long.fromString("40000"))
                .AddFunds(Uint128.zil((10 * this.spins).toString()))
                .send();
            notifi.show(
                "Transaction sent!",
                "black",
                //@ts-ignore
                `https://viewblock.io/zilliqa/tx/0x${result.tx.ID}?network=mainnet`,
                "See on viewblock"
            );
        } catch (e) {
            notifi.show(e.message ? e.message : JSON.stringify(e), "red");
        }
        runInAction(() => {
            this.sending = false;
        });
    }

    async claimSpins() {
        try {
            if (this.spins == 0) {
                throw new Error("Can't buy 0 spins");
            }
            runInAction(() => {
                this.sending = true;
            });
            const res = await fetch("/api/claim", {
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    target: walletManager.addr,
                }),
                method: "POST",
            });
            const data = await res.json();
            if (res.status == 401) {
                throw new Error(data.message);
            }
            const result = await slotMachineSdk.dangerousFromJSONCall(data.tx, Long.fromString("60000"));
            notifi.show(
                "Transaction sent!",
                "black",
                //@ts-ignore
                `https://viewblock.io/zilliqa/tx/0x${result.tx.ID}?network=mainnet`,
                "See on viewblock"
            );
        } catch (e) {
            notifi.show(e.message ? e.message : JSON.stringify(e), "red");
        }
        runInAction(() => {
            this.sending = false;
        });
    }

    async spin() {
        try {
            await walletManager.aquireWallet(true, true);
            if (walletManager.addr == "") {
                throw new Error("Connect zilpay first");
            }
            let stat = multiple.strongestMorph.power;
            runInAction(() => {
                this.spinning = true;
                this.sending = true;
            });
            const res = await fetch("/api/spin", {
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    morphStat: stat,
                    target: walletManager.addr,
                }),
                method: "POST",
            });
            const data = await res.json();
            if (res.status == 401) {
                throw new Error(data.message);
            }
            // console.log(data);
            // spinResult.show(data.winAmt, data.morphBonus);
        } catch (e) {
            notifi.show(e.message ? e.message : JSON.stringify(e), "red");
        }
        runInAction(() => {
            this.sending = false;
            this.spinning = false;
        });
    }

    async updateAddrStatus() {
        try {
            await walletManager.aquireWallet(true, true);
            if (walletManager.addr == "") {
                throw new Error("Connect zilpay first");
            }
            await fetch("/api/update", {
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    target: walletManager.addr,
                }),
                method: "POST",
            });
        } catch (e) {
            console.error(e);
        }
    }

    mount() {
        try {
            const app = getApp();
            const firestore = getFirestore(app);
            const docs = collection(firestore, `/addr/${new ByStr20(walletManager.addr).lowerCase()}/docs`);
            const status = doc(firestore, docs.path + "/status");
            const unsub1 = onSnapshot(status, (snap) => {
                runInAction(() => {
                    if (snap.data()) this.doc = snap.data() as AddressDoc;
                });
            });
            const unsub2 = onSnapshot(
                query(docs, orderBy("spinNum", "desc"), where("spinNum", ">", this.doc.spinsClaimed)),
                (snaps) => {
                    this.newestSpins = snaps.docs.map((d) => d.data()) as ThresholdJSON[];
                }
            );
            return () => {
                unsub1();
                unsub2();
            };
        } catch (e) {}
        return () => {};
    }
}
const buyerAndClaimer = new BuyerAndClaimer();

export default observer(() => {
    const context = useContext(ResponsiveContext);
    useEffect(() => {
        multiple.get(...walletManager.owned);
    }, [walletManager.owned]);

    useEffect(() => {
        buyerAndClaimer.updateAddrStatus();
        if (walletManager.addr != "") {
            const unsub = buyerAndClaimer.mount();
            return unsub;
        }
    }, [walletManager.addr, buyerAndClaimer.doc.spinsClaimed]);

    return (
        <>
            <Box flex="grow" justify="center" gap="medium" align="center">
                <Box
                    direction={context == "small" ? "column" : "row"}
                    flex="grow"
                    gap="medium"
                    align="center"
                    justify="center"
                    width={{ max: "550px" }}
                >
                    <Box flex="grow" align="center" width={{ max: "300px" }} fill="horizontal">
                        <Heading level="2">Past spins:</Heading>
                        <Box
                            align="start"
                            fill="horizontal"
                            height={{ min: "300px", max: "300px" }}
                            flex="grow"
                            overflow="auto"
                            elevation="small"
                            pad="small"
                            round="small"
                        >
                            {buyerAndClaimer.newestSpins.length == 0 && (
                                <Para>🤯 Here you will see your unclaimed spin history! 🤯</Para>
                            )}
                            {buyerAndClaimer.newestSpins.length != 0 &&
                                buyerAndClaimer.newestSpins.map((s) => (
                                    <Para key={s.spinNum + "spin"}>{spinToText(s)}</Para>
                                ))}
                            {/* <Heading level="2">Morphsino</Heading>
                                <Para>
                                    Welcome to morphsino the only casino that is
                                    configured to give on average the same
                                    amount of winnings as you put in in tickets!
                                    Every other casino is configured so that on
                                    average you loose!
                                </Para>
                                <Para>
                                    The twist is however that you pay zilmoph
                                    TAX on your winnings. That is the stronger
                                    your zilmorph the less in fees you will be
                                    paying!
                                </Para>
                                <Para>
                                    The base reward tax is 30%. For example: if
                                    you have a zilmorph with power stat = 250,
                                    and you win 420 ZIL (the highest prize). You
                                    will pay 70 ZIL in zilmorph TAX and the 350
                                    ZIL is yours.
                                </Para>
                                <Para>
                                    You can win either 20 ZIL 30 ZIL 70 ZIL 420
                                    ZIL per spin.
                                </Para> */}
                        </Box>
                        <Para>{`Available spins ${
                            buyerAndClaimer.doc.spinsOwned - buyerAndClaimer.doc.spinsExecuted
                        }`}</Para>
                        <Button
                            label={"Spin"}
                            disabled={buyerAndClaimer.sending}
                            onClick={() => buyerAndClaimer.spin()}
                        />
                        {buyerAndClaimer.doc.spinsExecuted - buyerAndClaimer.doc.spinsClaimed > 0 && (
                            <>
                                <Para>{`Claim ${new Big(
                                    buyerAndClaimer.newestSpins.reduce((prev, cur) => {
                                        return prev.add(new Big(cur.winAmt));
                                    }, new Big(0))
                                )
                                    .div(new Big(10).pow(12))
                                    .toFixed(2)}ZIL in rewards here:`}</Para>
                                <Button
                                    label={"Claim"}
                                    disabled={buyerAndClaimer.sending}
                                    onClick={() => buyerAndClaimer.claimSpins()}
                                />
                            </>
                        )}
                    </Box>
                    <Box flex="grow">
                        <Heading level="2">{`Spin with strongest: `}</Heading>
                        {multiple.strongestMorph.morph ? (
                            <Card morph={multiple.strongestMorph.morph} />
                        ) : (
                            <Para>{`No morph to spin with`}</Para>
                        )}
                    </Box>
                </Box>
                <Box align="center">
                    <Para>{`Buy spins here:`}</Para>
                    <Box direction="row" justify="center" align="center" gap="medium">
                        <Button
                            label={"buy"}
                            size="small"
                            disabled={buyerAndClaimer.sending}
                            onClick={() => buyerAndClaimer.buySpins()}
                        />
                        <TextInput
                            textAlign="end"
                            size="small"
                            value={buyerAndClaimer.spins}
                            type={"number"}
                            onChange={(e) => buyerAndClaimer.setSpins(e.target.value)}
                        />
                    </Box>
                </Box>
                <Anchor
                    icon={<Medium />}
                    label="Read more in this blog"
                    href={"https://medium.com/@msz.bednarski/zilmorphs-morphsino-7ffcaf0c6a61"}
                />
            </Box>
        </>
    );
});
