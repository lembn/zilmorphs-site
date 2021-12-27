import { deepMerge } from "grommet/utils";
import { grommet } from "grommet/themes";
import { Grommet } from "grommet";

export default function Global({ children }: { children: JSX.Element }) {
    return (
        <Grommet
            theme={deepMerge(grommet, {
                global: {
                    breakpoints: {
                        small: {
                            value: 535,
                        },
                        medium: {
                            value: 1400,
                        },
                        large: {
                            value: 1900,
                        },
                    },
                    colors: { brand: "black", text: "black" },
                },
            })}
            full
        >
            {children}
        </Grommet>
    );
}
