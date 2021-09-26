import { observer } from "mobx-react-lite";
import { Box, Text, Button, TextInput, Anchor } from "grommet";
import { Transaction } from "grommet-icons";
import { tokenDetails } from "../../util/config";
import { buyer } from "../../state/Buyer";
import { useEffect } from "react";
import { walletManager } from "../../state/WalletManager";
import { useRouter } from "next/router";

export default observer(() => {
    const router = useRouter();
    useEffect(() => {
        const u1 = buyer.subscribe();
        const u2 = walletManager.subscribe();
        return () => {
            u1();
            u2();
        };
    });
    return (
        <Box flex="grow" justify="center" gap="medium">
            <Box height="medium" width="medium" gap="medium">
                <Text
                    size="xlarge"
                    color="brand"
                    onClick={() => buyer.toggleState()}
                    style={{ cursor: "pointer", userSelect: "none" }}
                >{`${buyer.stateDisp} ${tokenDetails.symbol}`}</Text>
                <Box>
                    <Box border="all" round="small" pad="xsmall">
                        <Box direction="row" align="center">
                            <Text size="large">{`${tokenDetails.symbol}`}</Text>
                            <TextInput
                                plain
                                textAlign="end"
                                value={buyer.box1Disp}
                                type="number"
                                size="large"
                                focusIndicator={false}
                                onChange={(e) =>
                                    buyer.updateBuy(e.target.value)
                                }
                            />
                        </Box>
                        <Text size="xsmall">{`Owned: ${walletManager.zrc}`}</Text>
                    </Box>
                    <Box direction="row" align="center">
                        <Button
                            icon={
                                <Transaction
                                    style={{ transform: "rotate(90deg)" }}
                                    color="brand"
                                />
                            }
                            onClick={() => buyer.toggleState()}
                        />
                        <Text size="small">{`Avg price: ${buyer.avgPriceDisp}`}</Text>
                    </Box>

                    <Box border="all" round="small" pad="xsmall">
                        <Box direction="row" align="center">
                            <Text size="large">{`ZIL`}</Text>
                            <TextInput
                                plain
                                textAlign="end"
                                value={buyer.box2Disp}
                                size="large"
                                type="number"
                                focusIndicator={false}
                                onChange={() => {}}
                            />
                        </Box>
                        <Text size="xsmall">{`Owned: ${walletManager.zil}`}</Text>
                    </Box>
                </Box>
                <Button
                    disabled={!buyer.valid}
                    label={`${buyer.stateDisp} ${tokenDetails.symbol} ${
                        buyer.state == "BUY"
                            ? tokenDetails.happy
                            : tokenDetails.sad
                    }`}
                    color={buyer.state == "BUY" ? "status-ok" : "status-error"}
                    onClick={() => buyer.doTrade()}
                />
                {buyer.state == "SELL" && (
                    <Text size="xsmall">{`We take a 0.69% fee to feed the kats`}</Text>
                )}
                {buyer.lastTxLink && (
                    <Anchor
                        size="xsmall"
                        href={buyer.lastTxLink}
                        label="Your Tx will be available here"
                    />
                )}
            </Box>
        </Box>
    );
});
