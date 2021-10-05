import { observer } from "mobx-react-lite";
import {
    Box,
    Heading,
    Button,
    ResponsiveContext,
    Layer,
    TextInput,
    Anchor,
} from "grommet";
import { Medium } from "grommet-icons";
import { Para } from "../../components/Para";
import { useContext, useEffect } from "react";
import { Card } from "../../components/Card";
import { slotMachineSdk, walletManager } from "../../state/WalletManager";
import { multiple } from "../../state/DispMultiple";
import { makeAutoObservable, runInAction } from "mobx";
import { Long } from "@zilliqa-js/zilliqa";
import { addressbook } from "../../data/addressbook";
import { notifi, spinResult } from "../../state/Notification";
import { Uint128 } from "boost-zil";
import { getPower } from "../../state/shared";

class BuyerAndClaimer {
    sending = false;
    spinning = false;
    spins: number = 1;

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
            // console.log(data);
            spinResult.show(data.winAmt, data.morphBonus);
        } catch (e) {
            notifi.show(e.message ? e.message : JSON.stringify(e), "red");
        }
        runInAction(() => {
            this.sending = false;
            this.spinning = false;
        });
    }
}
const buyerAndClaimer = new BuyerAndClaimer();

export default observer(() => {
    const context = useContext(ResponsiveContext);
    useEffect(() => {
        multiple.get(...walletManager.owned);
    }, [walletManager.owned]);

    // useEffect(() => {
    //     walletManager.update();
    // }, []);

    return (
        <>
            <Box flex="grow" justify="center" gap="medium">
                <Box flex="grow" justify="center" align="center" gap="medium">
                    <Box
                        direction={context == "small" ? "column" : "row"}
                        flex="grow"
                        gap="medium"
                        align="center"
                        justify="center"
                        width={{ max: "550px" }}
                    >
                        <Box flex="grow">
                            <Box
                                align="center"
                                width={{ max: "350px" }}
                                flex="grow"
                            >
                                <Heading level="2">Morphsino</Heading>
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
                                    and you win 420 $ZIL (the highest prize).
                                    You will pay 70 $ZIL in zilmorph TAX and the
                                    350 ZIL is yours.
                                </Para>
                                <Para>
                                    You can win either $20ZIL $30ZIL $70ZIL
                                    $420ZIL per spin.
                                </Para>
                            </Box>
                            <Box direction="row" gap="medium">
                                <Button
                                    label={"buy spins"}
                                    size="small"
                                    disabled={buyerAndClaimer.sending}
                                    onClick={() => buyerAndClaimer.buySpins()}
                                />
                                <TextInput
                                    textAlign="end"
                                    value={buyerAndClaimer.spins}
                                    type={"number"}
                                    onChange={(e) =>
                                        buyerAndClaimer.setSpins(e.target.value)
                                    }
                                />
                            </Box>
                        </Box>
                        <Box gap="small" flex="grow">
                            <Heading level="2">{`Spin with strongest: `}</Heading>
                            {multiple.strongestMorph.morph ? (
                                <Card morph={multiple.strongestMorph.morph} />
                            ) : (
                                <Para>{`No morph to spin with`}</Para>
                            )}
                            <Box align="center">
                                <Button
                                    label={"Spin"}
                                    disabled={buyerAndClaimer.sending}
                                    onClick={() => buyerAndClaimer.spin()}
                                />
                            </Box>
                        </Box>
                    </Box>
                    <Anchor
                        icon={<Medium />}
                        label="Read more in this blog"
                        href={
                            "https://medium.com/@msz.bednarski/zilmorphs-576796584181"
                        }
                    />
                </Box>
            </Box>
        </>
    );
});
