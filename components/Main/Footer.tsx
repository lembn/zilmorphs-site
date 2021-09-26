import { Box, Anchor } from "grommet";
import { Github, Chat } from "grommet-icons";
import { useRouter } from "next/router";

export const Footer = () => {
    const router = useRouter();
    return (
        <Box justify="center" direction="row" align="center" gap="large">
            <Anchor onClick={() => router.push("/about")} label="about" />
            <Anchor label="telegram" href={"https://github.com/MszBednarski"} />
            <Anchor
                reverse
                icon={<Github />}
                href={"https://github.com/MszBednarski"}
                label="made with love"
            />
        </Box>
    );
};
