import { Box } from "grommet";
import Footer from "./Footer";
import Header from "./Header";
import ContentContainer from "./ContentContainer";
import Global from "../Global";
import { useState } from "react";
import { useSpring } from "@react-spring/web";

export default function Main({ children }: { children: any }) {
    const [showChildren, setShowChildren] = useState(true);
    const childrenFade = useSpring({ opacity: showChildren ? 1 : 0 });

    return (
        <Global>
            <Box fill>
                <Header showChildren={setShowChildren} />
                <ContentContainer styles={childrenFade} showChildren={showChildren}>
                    {children}
                </ContentContainer>
                <Footer />
            </Box>
        </Global>
    );
}
