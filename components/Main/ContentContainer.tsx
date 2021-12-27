import { ResponsiveContext } from "grommet";
import { ABox } from "./Animated";
import { useContext } from "react";

/*
This component was created to wrap the `children` elements of the Main component.

IT ONLY EXISTS because the the value of `ResponsiveContext` needs to be read (to set the
value of `fill` on the ABox) but if `ResponsiveContext` is imported in the same file as
the `Global` component, the value of the context is undefined, so this component was created
to move the import of the context into a seperate file.
*/

export default function ContentContainer({
    children,
    styles,
    showChildren,
}: {
    children: JSX.Element;
    styles: any;
    showChildren: boolean;
}) {
    const bpSize = useContext(ResponsiveContext);
    return (
        <ABox fill={bpSize == "small"} overflow="auto" style={styles}>
            {showChildren ? children : ""}
        </ABox>
    );
}
