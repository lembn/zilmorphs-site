import { Box, Button, Layer, Anchor, ResponsiveContext } from "grommet";
import { NextRouter, withRouter } from "next/router";
import { walletManager } from "../../state/WalletManager";
import { Btn } from "../Btn";
import { notifi, spinResult } from "../../state/Notification";
import { Para } from "../Para";
import { ABox, AButton } from "./Animated";
import { FaBars } from "react-icons/fa";
import { Spring } from "@react-spring/web";
import { Dispatch, SetStateAction, Component } from "react";

class Header extends Component {
    state: { expand: boolean };
    showChildren: Dispatch<SetStateAction<boolean>>;
    router: NextRouter;

    static contextType = ResponsiveContext;

    constructor(props) {
        super(props);
        this.state = { expand: false };
        this.showChildren = props.showChildren;
        this.router = props.router;
        this.toggle = this.toggle.bind(this);
        this.push = this.push.bind(this);
    }

    toggle() {
        this.setState({ expand: !this.state.expand }, () => {
            if (this.state.expand && this.context == "small") this.showChildren(false);
            else this.showChildren(true);
        });
    }

    push(path: string) {
        if (this.context == "small") this.toggle();
        this.router.push(path);
    }

    render() {
        return (
            <Box
                height={{ max: "70px" }}
                direction={this.context == "small" ? "column" : "row"}
                margin={{
                    horizontal: "medium",
                    bottom: this.context == "small" ? "none" : "xlarge",
                    top: this.context == "small" ? "medium" : "small",
                }}
                justify="between"
                gap="large"
                align="center"
                flex="grow"
            >
                <Button onClick={this.toggle}>
                    <FaBars size={27} />
                </Button>

                <Spring
                    to={{
                        opacity: this.state.expand ? 1 : 0,
                        marginTop: this.state.expand ? 0 : this.context == "small" ? 0 : -340,
                    }}
                >
                    {(styles) => (
                        <ABox
                            direction={this.context == "small" ? "column" : "row"}
                            align={this.context == "small" ? "center" : ""}
                            gap="large"
                            flex={this.context == "small" ? "grow" : "shrink"}
                            style={styles}
                        >
                            <Btn label={"home"} fontSize={"0.8em"} onClick={() => this.push("/dapp")} />
                            <Button
                                label={"buy"}
                                style={{ fontWeight: "bold" }}
                                size="small"
                                onClick={() => this.push("/dapp/get")}
                            />
                            <Button
                                label={"play"}
                                style={{ fontWeight: "bold" }}
                                size="small"
                                onClick={() => this.push("/dapp/play")}
                            />
                            <Btn fontSize={"0.8em"} label={"view"} onClick={() => this.push("/dapp/my")} />
                        </ABox>
                    )}
                </Spring>

                <Spring
                    to={{
                        opacity: this.state.expand ? 1 : 0,
                        marginTop: this.state.expand ? 0 : this.context == "small" ? 0 : -340,
                    }}
                    delay={70}
                >
                    {(styles) => (
                        <AButton
                            label={walletManager.connected ? "connected" : "connect zilpay"}
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
    }
}

export default withRouter(Header);
