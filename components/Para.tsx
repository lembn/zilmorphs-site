import { Paragraph } from "grommet";

export const Para = ({ children }) => (
    <Paragraph size="large" style={{ fontWeight: 600, fontSize: "0.7em" }}>
        {children}
    </Paragraph>
);
