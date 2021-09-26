import { observer } from "mobx-react-lite";
import { Box, Text, Anchor, TextInput, Button } from "grommet";
import { tokenDetails } from "../../util/config";
import { useEffect } from "react";
import { walletManager } from "../../state/WalletManager";
import { sender } from "../../state/Sender";

export default observer(() => {
    useEffect(() => {
        const u2 = walletManager.subscribe();
        return () => {
            u2();
        };
    });
    return (
        <Box flex="grow" justify="center" gap="medium">
            <Box height="medium" width="medium" gap="medium">
                <Text size="xlarge">{`Send ${tokenDetails.symbol}`}</Text>
                <Box gap="small">
                    <Box border="all" round="small" pad="xsmall">
                        <Box direction="row" align="center">
                            <Text size="large">{`${tokenDetails.symbol}`}</Text>
                            <TextInput
                                plain
                                textAlign="end"
                                value={sender.box1Disp}
                                type="number"
                                size="large"
                                focusIndicator={false}
                                onChange={(e) =>
                                    sender.updateBox1(e.target.value)
                                }
                            />
                        </Box>
                        <Text size="xsmall">{`Owned: ${walletManager.zrc}`}</Text>
                    </Box>
                    <Box border="all" round="small" pad="xsmall">
                        <Box direction="row" align="center">
                            <Text size="large">{`to: `}</Text>
                            <TextInput
                                plain
                                textAlign="end"
                                value={sender.box2Disp}
                                size="xsmall"
                                focusIndicator={false}
                                onChange={(e) =>
                                    sender.updateBox2(e.target.value)
                                }
                            />
                        </Box>
                        <Text
                            size="xsmall"
                            color={
                                sender.noAddress
                                    ? undefined
                                    : sender.isAddressValid
                                    ? "status-ok"
                                    : "status-error"
                            }
                        >{`Address valid: ${
                            sender.isAddressValid ? "yes" : "no"
                        }`}</Text>
                    </Box>
                </Box>
                <Button
                    disabled={!sender.valid}
                    label={`Send ${tokenDetails.happy} ${tokenDetails.symbol}`}
                    color={"status-ok"}
                    onClick={() => sender.doSend()}
                />
                {sender.lastTxLink && (
                    <Anchor
                        size="xsmall"
                        href={sender.lastTxLink}
                        label="Your Tx will be available here"
                    />
                )}
            </Box>
        </Box>
    );
});
