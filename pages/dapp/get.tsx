import { observer } from "mobx-react-lite";
import { Box, Paragraph, Heading, Button, ResponsiveContext } from "grommet";
import { useRouter } from "next/router";
import { useContext } from "react";
import { walletManager } from "../../state/WalletManager";

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
                <Heading
                    level="2"
                    color={walletManager.saleOpen ? "status-ok" : "status-error"}
                >
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
                        onClick={() => router.push("/dapp/get")}
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
                        onClick={() => router.push("/dapp/get")}
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
                        onClick={() => router.push("/dapp/get")}
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
