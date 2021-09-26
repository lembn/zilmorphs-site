import { observer } from "mobx-react-lite";
import { Box, Heading, Button, Text, Paragraph, Anchor } from "grommet";
import { tokenDetails } from "../util/config";
import { Hero } from "../components/Hero";

export default observer(() => {
    return (
        <Box overflow="auto" flex="grow">
            <Box flex="grow" pad={{ horizontal: "large" }}>
                <Heading level="3">{"What is so cool about it?"}</Heading>
                <Paragraph>
                    {`Every ${tokenDetails.symbol} token is backed by ZIL that is directly in the ${tokenDetails.symbol} contract. The only way to gain ${tokenDetails.symbol} is from the contract! No initial supply! ${tokenDetails.symbol} contract is automatically an exchange that has BUY and SELL functions!`}
                </Paragraph>
                <Heading level="3">{"How does it work?"}</Heading>
                <Paragraph>
                    {`${tokenDetails.symbol} token is the simplest bonding curve contract with the bonding curve function being f(x) = x. That means that each next ${tokenDetails.symbol} added to the total supply costs 1 more ZIL and each next ${tokenDetails.symbol} taken from the total supply sells for 1 less ZIL.`}
                </Paragraph>
                <Anchor
                    href={
                        "https://medium.com/coinmonks/token-bonding-curves-explained-7a9332198e0e"
                    }
                    label="wanna read about bounding curves?"
                />
            </Box>
        </Box>
    );
});
