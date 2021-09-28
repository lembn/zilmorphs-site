import { observer } from "mobx-react-lite";
import { Box, Button, Layer, Anchor } from "grommet";
import { useRouter } from "next/router";
import { walletManager } from "../../state/WalletManager";
import { But } from "../But";
import { notifi } from "../../state/Notification";
import { Para } from "../Para";

export const Main = observer(({ children }: { children: JSX.Element }) => {
    const router = useRouter();

    return (
        <Box fill>
            <Box fill style={{ position: "absolute", bottom: "0", zIndex: 0 }}>
                <Box pad="large" justify="between" direction="row" gap="large">
                    <Box direction="row" gap="large">
                        <But
                            label={"zilmorphs"}
                            onClick={() => router.push("/dapp")}
                        />
                        <But
                            label={"get"}
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
                            fontSize: "1em",
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
                            height={notifi.anchor ? "130px" : "90px"}
                            width={"30vw"}
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
                            >
                                <Para color={notifi.color}>{notifi.text}</Para>
                                {notifi.anchor != "" && (
                                    <Anchor
                                        style={{ color: "status-ok" }}
                                        label={notifi.anchorLabel}
                                        href={notifi.anchor}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Layer>
                )}
                {children}
            </Box>
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
