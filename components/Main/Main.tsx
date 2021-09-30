import { observer } from "mobx-react-lite";
import { Box, Button, Layer, Anchor } from "grommet";
import { useRouter } from "next/router";
import { walletManager } from "../../state/WalletManager";
import { But } from "../But";
import { notifi } from "../../state/Notification";
import { Para } from "../Para";
import { Footer } from "./Footer";

export const Main = observer(({ children }: { children: JSX.Element }) => {
    const router = useRouter();

    return (
        <Box fill>
            <Box flex="grow" height={{ max: "100px" }}>
                <Box
                    pad="medium"
                    justify="around"
                    direction="row"
                    gap="large"
                    flex="grow"
                >
                    <Box direction="row" gap="large">
                        <But
                            label={"zilmorphs"}
                            onClick={() => router.push("/dapp")}
                        />
                        <Button
                            label={"get"}
                            style={{ fontWeight: "bold" }}
                            size="small"
                            onClick={() => router.push("/dapp/get")}
                        />
                        <But
                            label={"my morphs"}
                            onClick={() => router.push("/dapp/my")}
                        />
                    </Box>
                    <Button
                        label={
                            walletManager.connected
                                ? "connected"
                                : "connect zilpay"
                        }
                        plain
                        style={{
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
            </Box>
            {children}
            <Footer />
            {/* <Canvas
                style={{
                    position: "absolute",
                    top: "0px",
                    pointerEvents: "none",
                }}
            >
                <Scene top={top} mouse={mouse} />
            </Canvas> */}
        </Box>
    );
});
