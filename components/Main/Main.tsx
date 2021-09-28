import { observer } from "mobx-react-lite";
import { Box, Button, Text } from "grommet";
import { useRouter } from "next/router";
import {
    useSpring,
    a,
    AnimatedComponent,
    SpringValue,
    to,
} from "@react-spring/three";
import { useCallback, useMemo, useRef, FC, useEffect, useState } from "react";
import { useThree, Canvas, useFrame } from "@react-three/fiber";
import { walletManager } from "../../state/WalletManager";
import { But } from "../But";

export const Main = observer(({ children }: { children: JSX.Element }) => {
    const router = useRouter();
    const [{ top, mouse }, set] = useSpring(() => ({ top: 0, mouse: [0, 0] }));

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
                            walletManager.connected ? "connected" : "connect"
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
                                alert(e);
                            }
                        }}
                    />
                </Box>
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
