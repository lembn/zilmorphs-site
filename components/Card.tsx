import { Box, Tip, Text, Heading } from "grommet";
import { ApiMorph } from "../data/interfaces";
import { observer } from "mobx-react-lite";

export const Card = observer(({ morph }: { morph: ApiMorph }) => {
    return (
        <Box
            flex="grow"
            gap="small"
            background="white"
            pad="small"
            round="xsmall"
            elevation="large"
            width={{ min: "400px", max: "400px" }}
            height={{ max: "650px" }}
            align="center"
        >
            <Heading level="2">{`#${morph.num} ${morph.data.name}`}</Heading>
            <img src={morph.pic} width="300" height="300" />
            <Box direction="row" fill>
                <Box fill>
                    <Heading level="3">Stats</Heading>
                    <Text
                        size="xsmall"
                        style={{ fontWeight: "bold" }}
                    >{`Strength: ${morph.data.stats.str}`}</Text>
                    <Text
                        size="xsmall"
                        style={{ fontWeight: "bold" }}
                    >{`Agility: ${morph.data.stats.agi}`}</Text>
                    <Text
                        size="xsmall"
                        style={{ fontWeight: "bold" }}
                    >{`Inteligence: ${morph.data.stats.int}`}</Text>
                </Box>
                <Box fill>
                    <Heading level="3">Special</Heading>
                    {morph.data.stats.special.length == 0 ? (
                        <Text size="small" style={{ fontWeight: "bold" }}>
                            No specials!
                        </Text>
                    ) : (
                        morph.data.stats.special.map((s) => (
                            <Text
                                key={s.desc}
                                size="xsmall"
                                style={{ fontWeight: "bold" }}
                            >
                                {`${s.desc}`}
                            </Text>
                        ))
                    )}
                </Box>
            </Box>
        </Box>
    );
});
