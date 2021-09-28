import { Paragraph } from "grommet";

export const Para = ({ children, color } :{children: any, color?: string}) => (
    <Paragraph
        size="large"
        style={{
            fontWeight: 600,
            fontSize: "0.7em",
            color: color ? color : "black",
        }}
    >
        {children}
    </Paragraph>
);
