import { observer } from "mobx-react-lite";
import {
    Box,
    Paragraph,
    Heading,
    Button,
    ResponsiveContext,
    Layer,
    TextInput,
} from "grommet";
import { useRouter } from "next/router";
import { useContext } from "react";
import { walletManager, tokenSdk } from "../../state/WalletManager";
import { makeAutoObservable, runInAction } from "mobx";
import Big from "big.js";
import { ByStr20, Uint128 } from "boost-zil";
import { Long } from "@zilliqa-js/zilliqa";

class Buyer {
    show: boolean = false;
    type: "zETH" | "zWBTC" | "zUSDT" = "zETH";
    value = 0;
    sending = false;

    get valid() {
        return typeof this.value == "number";
    }

    get dispVal() {
        return this.value;
    }

    setVal(s: string) {
        this.value = parseFloat(s);
    }

    constructor() {
        makeAutoObservable(this);
    }

    hide() {
        this.show = false;
    }

    showUI(s: "zETH" | "zWBTC" | "zUSDT", init: string) {
        this.type = s;
        this.show = true;
        this.value = parseFloat(init);
    }

    async send(data: { token: ByStr20; seller: ByStr20; decimals: number }) {
        try {
            runInAction(() => {
                this.sending = true;
            });
            const amt = new Uint128(
                new Big(this.value)
                    .mul(new Big(10).pow(data.decimals))
                    .toFixed(0)
            );
            await tokenSdk
                .calls(data.token)(Long.fromString("40000"))
                .Transfer(data.seller, amt)
                .send();
        } catch (e) {
            alert(e);
        }
        runInAction(() => {
            this.sending = false;
        });
    }
}

const buyer = new Buyer();

export default observer(() => {
    const router = useRouter();
    const context = useContext(ResponsiveContext);

    return (
        <Box
            direction={context == "small" ? "column" : "row"}
            flex="grow"
            justify="center"
            align="center"
            pad="small"
        >
            {buyer.show && (
                <Layer
                    onEsc={() => buyer.hide()}
                    onClickOutside={() => buyer.hide()}
                    responsive={false}
                    plain
                >
                    <Box
                        alignSelf="center"
                        justify="center"
                        height="medium"
                        width="medium"
                        background="white"
                        round="small"
                        elevation="large"
                        align="center"
                        gap="medium"
                    >
                        <Box>
                            <Heading level="2">{`Buy with ${buyer.type}`}</Heading>
                            <Paragraph
                                size="large"
                                style={{ fontWeight: 600, fontSize: "0.8em" }}
                            >
                                {`You have ${walletManager.typeToBalance(
                                    buyer.type
                                )} ${buyer.type}`}
                            </Paragraph>
                            <Paragraph
                                size="large"
                                style={{ fontWeight: 600, fontSize: "0.8em" }}
                            >
                                {`Current price is: ${walletManager.typeToPrice(
                                    buyer.type
                                )} ${buyer.type}`}
                            </Paragraph>
                            <Box>
                                <TextInput
                                    textAlign="end"
                                    value={buyer.dispVal}
                                    type={"number"}
                                    onChange={(e) =>
                                        buyer.setVal(e.target.value)
                                    }
                                />
                            </Box>
                        </Box>
                        <Button
                            label={"send"}
                            disabled={buyer.sending || !buyer.valid}
                            plain
                            style={{ fontSize: "1.8em", fontWeight: "bold" }}
                            onClick={() =>
                                buyer.send(
                                    walletManager.typeToAddress(buyer.type)
                                )
                            }
                        />
                    </Box>
                </Layer>
            )}
            <Box align="center" width={{ max: "350px" }} flex="grow">
                <Heading>Get Zilmorphs</Heading>
                <Paragraph
                    size="large"
                    style={{ fontWeight: 600, fontSize: "0.8em" }}
                >
                    Zilmorphs are creatures from a different universe that got
                    here with the Zilliqa bridge! You can ONLY get zilmorphs
                    with Zilliqa bridge assets: zETH, zWBTC, zUSDT.
                </Paragraph>
                <Paragraph
                    size="large"
                    style={{ fontWeight: 600, fontSize: "0.8em" }}
                >
                    Each next zilmorph sold increases the price of the next by
                    ~1 USD worth of the bridge assets. That means that the first
                    zilmorph costs ~1$ but the last may cost even 8000$!
                </Paragraph>
                <Paragraph
                    size="large"
                    style={{ fontWeight: 600, fontSize: "0.8em" }}
                >
                    If there is a lot of transactions at the same time and you
                    are worried that somebody might snatch a zilmorph at your
                    current price you may send more to the contract, you will be
                    refunded for any overpay!
                </Paragraph>
            </Box>
            <Box
                flex="grow"
                pad="small"
                gap="medium"
                align="center"
                width={{ max: "550px" }}
            >
                <Heading level="2">
                    {walletManager.saleOpen ? "Sale open" : "Sale closed"}
                </Heading>
                <Box direction="row" gap="medium">
                    <Button
                        label={"get with zETH"}
                        plain
                        style={{
                            fontSize: "1.8em",
                            fontWeight: "bold",
                        }}
                        onClick={() =>
                            buyer.showUI(
                                "zETH",
                                walletManager.typeToPrice("zETH")
                            )
                        }
                    />
                    <Paragraph
                        size="large"
                        style={{ fontWeight: 600, fontSize: "0.8em" }}
                    >
                        {`Current price: ${walletManager.zethP} zETH`}
                    </Paragraph>
                </Box>
                <Box direction="row" gap="medium">
                    <Button
                        label={"get with zWBTC"}
                        plain
                        style={{
                            fontSize: "1.8em",
                            fontWeight: "bold",
                        }}
                        onClick={() =>
                            buyer.showUI(
                                "zWBTC",
                                walletManager.typeToPrice("zWBTC")
                            )
                        }
                    />
                    <Paragraph
                        size="large"
                        style={{ fontWeight: 600, fontSize: "0.8em" }}
                    >
                        {`Current price: ${walletManager.zwbtcP} zWBTC`}
                    </Paragraph>
                </Box>
                <Box direction="row" gap="medium">
                    <Button
                        label={"get with zUSDT"}
                        plain
                        style={{
                            fontSize: "1.8em",
                            fontWeight: "bold",
                        }}
                        onClick={() =>
                            buyer.showUI(
                                "zUSDT",
                                walletManager.typeToPrice("zUSDT")
                            )
                        }
                    />
                    <Paragraph
                        size="large"
                        style={{ fontWeight: 600, fontSize: "0.8em" }}
                    >
                        {`Current price: ${walletManager.zusdtP} zUSDT`}
                    </Paragraph>
                </Box>
            </Box>
        </Box>
    );
});
