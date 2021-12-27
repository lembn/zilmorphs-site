import { useSpring } from "@react-spring/web";
import { ResponsiveContext } from "grommet";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { ABox } from "./Animated";
import { HeaderExpand } from "./Header";

/*
This component was created because i coudln't find a way to get the ResponsiveContext
to work from the `Main.tsx` file, so i moved the code that requried the context information
into a new component, in a seperate file
*/
export default observer(({ children, expand }: { children: JSX.Element; expand: HeaderExpand }) => {
    const bpSize = useContext(ResponsiveContext);
    const styles = useSpring({ opacity: expand.value && bpSize == "small" ? 0 : 1 });

    return (
        <ABox fill={bpSize == "small"} overflow="auto" style={styles}>
            {expand.value && bpSize == "small" ? "" : children}
        </ABox>
    );
});
