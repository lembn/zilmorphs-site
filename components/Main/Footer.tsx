import { Box, Anchor } from "grommet";
import { Github, Twitter } from "grommet-icons";
import { useRouter } from "next/router";

export const Footer = () => {
    const router = useRouter();
    return (
        <Box justify="center" direction="row" align="center" gap="large">
            <Anchor onClick={() => router.push("/press")} label="press" />
            <Anchor label="telegram" href={"https://t.co/VJIdO5vV3o?amp=1"} />
            <Anchor
                reverse
                icon={<Twitter />}
                href={"https://twitter.com/zilmorphs"}
            />
        </Box>
    );
};
