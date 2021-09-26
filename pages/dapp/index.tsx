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

    return (
        <Box flex="grow" justify="center" gap="medium">
            <Box height="medium" width="medium" gap="medium">
  
            </Box>
        </Box>
    );
});
