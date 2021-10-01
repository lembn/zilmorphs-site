import { Box, Tip, Text, Heading, Button } from "grommet";
import { ApiMorph } from "../data/interfaces";
import { observer } from "mobx-react-lite";
import domtoimage from "dom-to-image";
import filesaver from "file-saver";
import { useState } from "react";

export const Card = observer(({ morph }: { morph: ApiMorph }) => {
    const [hide, setHide] = useState(false);
    async function toPng() {
        setHide(true);
        try {
            let scale = 2;
            const domNode = document.getElementById(`morph-card-${morph.num}`);
            const blob = await domtoimage.toBlob(domNode, {
                width: domNode.clientWidth * scale,
                height: domNode.clientHeight * scale,
                style: {
                    transform: "scale(" + scale + ")",
                    transformOrigin: "top left",
                },
            });
            filesaver.saveAs(blob, `${morph.num}.png`);
        } catch (e) {
            console.log(e);
        }
        setHide(false);
    }
    return (
        <Box
            id={`morph-card-${morph.num}`}
            flex="grow"
            gap="small"
            background="white"
            pad="small"
            round="xsmall"
            elevation="large"
            width={{ min: "300px", max: "375px" }}
            height={{ max: "650px" }}
            align="center"
            margin="small"
        >
            <Heading level="2">{`#${morph.num} ${morph.data.name}`}</Heading>
            <img src={morph.pic} width="200" height="200" />
            <Box direction="row" fill pad="small">
                <Box fill>
                    <Heading level="3">Stats</Heading>
                    <Text
                        size="xsmall"
                        style={{ fontWeight: "bold" }}
                        color="neutral-3"
                    >{`Power: ${(
                        morph.data.stats.str +
                        morph.data.stats.agi +
                        morph.data.stats.int
                    ).toFixed(3)}`}</Text>
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
                    >{`Intelligence: ${morph.data.stats.int}`}</Text>
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
            {!hide && (
                <Button
                    label={"get png"}
                    style={{ fontWeight: "bold" }}
                    size="small"
                    onClick={() => toPng()}
                />
            )}
        </Box>
    );
});
