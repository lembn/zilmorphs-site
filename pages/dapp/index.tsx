import { observer } from "mobx-react-lite";
import { Box, Paragraph, Heading } from "grommet";
import { useRouter } from "next/router";

export default observer(() => {
    const router = useRouter();

    return (
        <Box flex="grow" justify="center" gap="medium">
            <Box
                height="medium"
                width="medium"
                gap="medium"
                align="center"
                fill="horizontal"
            >
                <Heading>Zilmorphs</Heading>
                <Paragraph size="large" style={{ fontWeight: 600 }}>
                    Zilmorphs is a collection of 8,000 machine learning
                    generated creatures on the Zilliqa blockchain.
                </Paragraph>
                <Paragraph size="large" style={{ fontWeight: 600 }}>
                    Zilmorphs were created to celebrate the creation of the
                    Zilliqa bridge and can only be bought with Zilliqa bridge
                    assets.
                </Paragraph>
            </Box>
        </Box>
    );
});
