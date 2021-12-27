import { Box, Anchor, ResponsiveContext } from "grommet";
import { Medium, Twitter } from "grommet-icons";
import { useRouter } from "next/router";
import { useContext } from "react";

export default function Footer() {
    const router = useRouter();
    const bpSize = useContext(ResponsiveContext);
    return (
        <Box justify="center" direction="row" align="center" gap="large" flex={bpSize == "small" ? "shrink" : "grow"}>
            <Anchor onClick={() => router.push("/press")} label="press" />
            <Anchor label="telegram" href={"https://t.me/zilmorphs"} />
            <Anchor reverse icon={<Twitter />} href={"https://twitter.com/zilmorphs"} />
            <Anchor icon={<Medium />} href={"https://medium.com/@msz.bednarski/zilmorphs-576796584181"} />
        </Box>
    );
}
