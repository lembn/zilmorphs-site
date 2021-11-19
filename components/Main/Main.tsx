import { observer } from "mobx-react-lite";
import { Box, Button, Layer, Anchor } from "grommet";
import { useRouter } from "next/router";
import { walletManager } from "../../state/WalletManager";
import { But } from "../But";
import { notifi, spinResult } from "../../state/Notification";
import { Para } from "../Para";
import { Footer } from "./Footer";
import { FaBars } from "react-icons/fa";

export const Main = observer(({ children }: { children: JSX.Element }) => {
    const router = useRouter();

    return (
        <Box fill>
            <Box height={{ max: "70px" }} flex="grow">
                <Box
                    justify="around"
                    direction="row"
                    gap="large"
                    flex="grow"
                    margin="medium"
                >
                    <Button
                        onMouseEnter={() => {
                            //Fade animation
                        }}
                    >
                        <FaBars size={28} />
                    </Button>
                    <Box direction="row" gap="large">
                        <But
                            label={"zilmorphs"}
                            fontSize={"0.8em"}
                            onClick={() => router.push("/dapp")}
                        />
                        <Button
                            label={"buy"}
                            style={{ fontWeight: "bold" }}
                            size="small"
                            onClick={() => router.push("/dapp/get")}
                        />
                        <Button
                            label={"play"}
                            style={{ fontWeight: "bold" }}
                            size="small"
                            onClick={() => router.push("/dapp/play")}
                        />
                        <But
                            fontSize={"0.8em"}
                            label={"view"}
                            onClick={() => router.push("/dapp/my")}
                        />
                    </Box>
                    <Button
                        label={
                            walletManager.connected
                                ? "connected"
                                : "connect zilpay"
                        }
                        size="small"
                        plain
                        style={{
                            fontSize: "0.8em",
                            fontWeight: "bold",
                            color: walletManager.connected ? "green" : "black",
                        }}
                        onClick={async () => {
                            try {
                                await walletManager.aquireWallet();
                            } catch (e) {
                                if (e.message == "No zilpay") {
                                    notifi.show(
                                        e.message
                                            ? e.message
                                            : JSON.stringify(e),
                                        "red",
                                        "https://zilpay.io/",
                                        "Get zilpay here"
                                    );
                                } else {
                                    notifi.show(
                                        e.message
                                            ? e.message
                                            : JSON.stringify(e),
                                        "red"
                                    );
                                }
                            }
                        }}
                    />
                </Box>
                {notifi.visible && (
                    <Layer
                        plain
                        position="top"
                        onClickOutside={() => notifi.setVisible(false)}
                        onEsc={() => notifi.setVisible(false)}
                        responsive={false}
                    >
                        <Box
                            height={notifi.anchor ? "100px" : "90px"}
                            width={"350px"}
                            pad="small"
                            flex="grow"
                        >
                            <Box
                                elevation="large"
                                round="small"
                                background="white"
                                fill
                                align="center"
                                justify="center"
                                pad="small"
                            >
                                <Para color={notifi.color}>{notifi.text}</Para>
                                {notifi.anchor != "" && (
                                    <Anchor
                                        style={{
                                            color: "status-ok",
                                            fontSize: "0.8em",
                                        }}
                                        label={notifi.anchorLabel}
                                        href={notifi.anchor}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Layer>
                )}
                {spinResult.visible && (
                    <Layer
                        plain
                        onClickOutside={() => spinResult.setVisible(false)}
                        onEsc={() => spinResult.setVisible(false)}
                        responsive={false}
                    >
                        <Box
                            height={"100px"}
                            width={"400px"}
                            pad="small"
                            flex="grow"
                        >
                            <Box
                                elevation="large"
                                round="small"
                                background="white"
                                fill
                                align="center"
                                justify="center"
                                pad="small"
                            >
                                {spinResult.won ? (
                                    <Para>{`You won total: ${spinResult.win} ZIL. Morph earned: ${spinResult.bonus} ZIL`}</Para>
                                ) : (
                                    <Para>{`No reward! Good luck next time!`}</Para>
                                )}
                            </Box>
                        </Box>
                    </Layer>
                )}
            </Box>
            {children}
            <Footer />
        </Box>
    );
});
