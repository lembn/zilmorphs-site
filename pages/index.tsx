import { observer } from "mobx-react-lite";
import { Box, Heading, Button, Text } from "grommet";
import { tokenDetails } from "../util/config";
import { LiveStats } from "../components/LiveStats";
import { useRouter } from "next/router";
import { Hero } from "../components/Hero";

export default observer(() => {
    const router = useRouter();
    return (
        <Box flex="grow" justify="center">
            <Hero />
            <LiveStats />
            <br />
            <Box>
                <Button
                    color="black"
                    label="Go to dApp"
                    onClick={() => router.push("dapp")}
                />
            </Box>
        </Box>
    );
});
