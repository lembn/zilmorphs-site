import { Box } from "grommet";
import Footer from "./Footer";
import { Header, HeaderExpand } from "./Header";
import Global from "../Global";
import { observer } from "mobx-react-lite";
import ContentContainer from "./ContentContainer";

const expand = new HeaderExpand();

export default observer(({ children }: { children: any }) => {
    return (
        <Global>
            <Box fill>
                <Header expand={expand} />
                <ContentContainer expand={expand}>{children}</ContentContainer>
                <Footer />
            </Box>
        </Global>
    );
});
