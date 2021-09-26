import { Heading, Paragraph, Text } from "grommet";
import { tokenDetails } from "../util/config";

export const Hero = () => (
    <>
        <Heading>{`${tokenDetails.emoji} ${tokenDetails.symbol} Token`}</Heading>
        <Paragraph>{"The first Zilliqa bonding curve token"}</Paragraph>
    </>
);
