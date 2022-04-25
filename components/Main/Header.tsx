import { Box, Button, Layer, Anchor, ResponsiveContext } from "grommet";
import { useRouter } from "next/router";
import { walletManager } from "../../state/WalletManager";
import { Btn } from "../Btn";
import { notifi, spinResult } from "../../state/Notification";
import { Para } from "../Para";
import { ABox, AButton } from "./Animated";
import { FaBars } from "react-icons/fa";
import { Spring } from "@react-spring/web";
import { makeObservable, observable, action } from "mobx";
import { observer } from "mobx-react-lite";
import { useContext } from "react";

export class HeaderExpand {
    value: boolean = false;

    constructor() {
        makeObservable(this, { value: observable, toggle: action });
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.value = !this.value;
    }
}

export const Header = observer(({ expand }: { expand: HeaderExpand }) => {
    const bpSize = useContext(ResponsiveContext);
    const router = useRouter();

    function push(path: string) {
        if (bpSize == "small") expand.toggle();
        router.push(path);
    }

    return (
        <Box
            height={{ max: "70px" }}
            direction={bpSize == "small" ? "column" : "row"}
            margin={{
                horizontal: "medium",
                bottom: bpSize == "small" ? "none" : "xlarge",
                top: bpSize == "small" ? "medium" : "small",
            }}
            justify="between"
            gap="large"
            align="center"
            flex="grow"
        >
            <Button onClick={expand.toggle}>
                <FaBars size={27} />
            </Button>

            <Spring
                to={{
                    opacity: expand.value ? 1 : 0,
                    marginTop: expand.value ? 0 : bpSize == "small" ? 0 : -340,
                }}
            >
                {(styles) => (
                    <ABox
                        direction={bpSize == "small" ? "column" : "row"}
                        align={bpSize == "small" ? "center" : ""}
                        gap="large"
                        flex={bpSize == "small" ? "grow" : "shrink"}
                        style={styles}
                    >
                        <Btn label={"Home"} fontSize={"0.8em"} onClick={() => push("/dapp")} />
                        <Button
                            label={"Buy"}
                            style={{ fontWeight: "bold" }}
                            size="small"
                            onClick={() => push("/dapp/get")}
                        />
                        <Button
                            label={"Arcade"}
                            style={{ fontWeight: "bold" }}
                            size="small"
                            onClick={() => push("/dapp/arcade")}
                        />
                        <Btn fontSize={"0.8em"} label={"View"} onClick={() => push("/dapp/my")} />
                    </ABox>
                )}
            </Spring>

            <Spring
                to={{
                    opacity: expand.value ? 1 : 0,
                    marginTop: expand.value ? 0 : bpSize == "small" ? 0 : -340,
                }}
                delay={70}
            >
                {(styles) => (
                    <AButton
                        label={walletManager.connected ? "connected" : "connect Zilpay"}
                        size="small"
                        plain
                        style={{
                            ...styles,
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
                                        e.message ? e.message : JSON.stringify(e),
                                        "red",
                                        "https://zilpay.io/",
                                        "Get zilpay here"
                                    );
                                } else {
                                    notifi.show(e.message ? e.message : JSON.stringify(e), "red");
                                }
                            }
                        }}
                    />
                )}
            </Spring>

            {notifi.visible && (
                <Layer
                    plain
                    position="top"
                    onClickOutside={() => notifi.setVisible(false)}
                    onEsc={() => notifi.setVisible(false)}
                    responsive={false}
                >
                    <Box height={notifi.anchor ? "100px" : "90px"} width={"350px"} pad="small" flex="grow">
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
                    <Box height={"100px"} width={"400px"} pad="small" flex="grow">
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
    );
});
