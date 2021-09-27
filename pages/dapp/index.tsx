import { observer } from "mobx-react-lite";
import { Box, Paragraph, Heading, Button } from "grommet";
import { useRouter } from "next/router";
import { ApiMorph } from "../../data/interfaces";
import { makeAutoObservable, runInAction } from "mobx";
import { Card } from "../../components/Card";
import { useEffect } from "react";

class RandomDisp {
    morph: ApiMorph = {
        num: "1",
        pic: "/morph/1.png",
        data: {
            name: "volotcth h",
            stats: {
                str: 12.16,
                agi: 27.572,
                int: 82.353,
                special: [
                    {
                        desc: "Genius. Top 17.647%",
                        percentage: 17.647,
                    },
                    {
                        desc: "Weakling. Bottom 12.16%",
                        percentage: 12.16,
                    },
                ],
            },
        },
    };

    constructor() {
        makeAutoObservable(this);
    }

    async random() {
        try {
            const res = await fetch("/api/random", {
                headers: { "Content-type": "application/json" },
            });
            const data = await res.json();
            runInAction(() => {
                this.morph = data;
            });
        } catch (e) {
            console.error(e);
        }
    }
}

const disp = new RandomDisp();

export default observer(() => {
    useEffect(() => {
        disp.random();
    }, []);

    return (
        <Box flex="grow" justify="center" gap="medium">
            <Box flex="grow">
                <Box direction="row" flex="grow" justify="around" pad="small">
                    <Box align="center" width={{ max: "350px" }}>
                        <Heading>Zilmorphs</Heading>
                        <Paragraph
                            size="large"
                            style={{ fontWeight: 600, fontSize: "1em" }}
                        >
                            Zilmorphs is a collection of 8,000 machine learning
                            generated creatures on the Zilliqa blockchain.
                        </Paragraph>
                        <Paragraph
                            size="large"
                            style={{ fontWeight: 600, fontSize: "1em" }}
                        >
                            Zilmorphs were created to celebrate the creation of
                            the Zilliqa bridge and can only be bought with
                            Zilliqa bridge assets.
                        </Paragraph>
                        <Box align="center">
                            <Button
                                label={"Random morph"}
                                plain
                                style={{
                                    fontSize: "1.5em",
                                    fontWeight: "bold",
                                }}
                                onClick={() => disp.random()}
                            />
                        </Box>
                    </Box>
                    <Box align="center" gap="medium">
                        <Card morph={disp.morph} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
});
