import { Box, Button, Anchor } from "grommet";
import { Connect, Link } from "grommet-icons";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { walletManager } from "../../state/WalletManager";
import { tokenDetails } from "../../util/config";

export const Head = observer(() => {
    const router = useRouter();
    return (
        <Box
            justify="between"
            direction="row"
            align="center"
            gap="small"
            pad={{ top: "small", horizontal: "small" }}
            fill="horizontal"
        >
            <Box pad={{ left: "small" }}>
                <Button
                    color="black"
                    label={tokenDetails.dispName}
                    onClick={() => router.push("/")}
                    plain
                />
            </Box>
            <Button
                color="black"
                label="trade"
                onClick={() => router.push("/dapp")}
                plain
            />
            <Button
                color="black"
                label="send"
                onClick={() => router.push("/dapp/send")}
                plain
            />
            {!walletManager.connected ? (
                <Button
                    color="black"
                    size="small"
                    icon={<Connect color="black" size="small" />}
                    label="Connect"
                    onClick={() => {
                        walletManager.aquireWallet();
                    }}
                />
            ) : (
                <Button
                    color="black"
                    size="small"
                    icon={<Link color="black" />}
                    onClick={() => {}}
                />
            )}
        </Box>
    );
});
