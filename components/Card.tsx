import { Box, Tip, Text, Heading, Button, Layer, TextInput } from "grommet";
import { ApiMorph } from "../data/interfaces";
import { observer } from "mobx-react-lite";
import domtoimage from "dom-to-image";
import filesaver from "file-saver";
import { useState } from "react";
import { makeAutoObservable } from "mobx";
import { runInAction } from "mobx";
import { ByStr20, Uint256 } from "boost-zil";
import { notifi } from "../state/Notification";
import { zilmorphsSdk } from "../state/WalletManager";
import { Para } from "./Para";
import { Long } from "@zilliqa-js/zilliqa";
import { addressbook } from "../data/addressbook";

export const Card = observer(
    ({ morph, owned }: { morph: ApiMorph; owned?: boolean }) => {
        const [hide, setHide] = useState(false);
        const [sending, setSending] = useState(false);
        const [show, setShow] = useState(false);
        const [target, setTarget] = useState("");
        async function toPng() {
            setHide(true);
            try {
                let scale = 2;
                const domNode = document.getElementById(
                    `morph-card-${morph.num}`
                );
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
        async function transfer() {
            try {
                setSending(true);
                const result = await zilmorphsSdk
                    .calls(addressbook.ZILMORPHS_ADDRESS)(
                        Long.fromString("40000")
                    )
                    .Transfer(new ByStr20(target), new Uint256(morph.num))
                    .send();
                notifi.show(
                    "Transaction sent!",
                    "black",
                    //@ts-ignore
                    `https://viewblock.io/zilliqa/tx/0x${result.tx.ID}?network=mainnet`,
                    "See on viewblock"
                );
            } catch (e) {
                notifi.show(e.message ? e.message : JSON.stringify(e), "red");
            }
            setSending(false);
        }

        return (
            <>
                {show && (
                    <Layer
                        onEsc={() => setShow(false)}
                        onClickOutside={() => setShow(false)}
                        responsive={false}
                        plain
                    >
                        <Box
                            alignSelf="center"
                            justify="center"
                            height="medium"
                            width="medium"
                            background="white"
                            round="small"
                            elevation="large"
                            align="center"
                            gap="medium"
                        >
                            <Box>
                                <Heading level="2">{`Transfer #${morph.num}`}</Heading>
                                <Para>{`Send your morph to a different address.`}</Para>
                                <Box>
                                    <TextInput
                                        placeholder={
                                            "checksummed or bech32 address"
                                        }
                                        size="small"
                                        value={target}
                                        onChange={(e) =>
                                            setTarget(e.target.value)
                                        }
                                    />
                                </Box>
                            </Box>
                            <Button
                                label={"send"}
                                disabled={!ByStr20.isValid(target)}
                                plain
                                style={{
                                    fontSize: "1.1em",
                                    fontWeight: "bold",
                                }}
                                onClick={() => transfer()}
                            />
                        </Box>
                    </Layer>
                )}
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
                                <Text
                                    size="small"
                                    style={{ fontWeight: "bold" }}
                                >
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
                    {!hide && owned && (
                        <Box direction="row" gap="small">
                            <Button
                                label="send"
                                style={{ fontWeight: "bold" }}
                                size="small"
                                onClick={() => setShow(true)}
                            />
                            <Button
                                label={"get png"}
                                style={{ fontWeight: "bold" }}
                                size="small"
                                onClick={() => toPng()}
                            />
                        </Box>
                    )}
                </Box>
            </>
        );
    }
);
