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
                <Heading>{`you have no morhps`}</Heading>
              
            </Box>
        </Box>
    );
});
