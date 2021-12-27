import { observer } from "mobx-react-lite";
import { Box, Heading } from "grommet";
import { ApiMorph } from "../../data/interfaces";
import { makeAutoObservable, runInAction } from "mobx";
import { Card } from "../../components/Card";
import { useEffect } from "react";
import { Para } from "../../components/Para";
import { Btn } from "../../components/Btn";

class RandomDisp {
    morph: ApiMorph = {
        num: "1",
        pic: "/morph/1.png",
        link: "https://zilmorphs.com/api/morph/1",
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
        <>
            <Box flex="grow" justify="center" pad="small" align="center" gap="large">
                <Box align="center" width={{ max: "350px" }} flex="grow">
                    <Heading level="2">Zilmorphs</Heading>
                    <Para>
                        Zilmorphs is a collection of 8,000 machine learning generated creatures on the Zilliqa
                        blockchain.
                    </Para>
                    <Para>
                        Zilmorphs were created to celebrate the creation of the Zilliqa bridge and can only be bought
                        with Zilliqa bridge assets.
                    </Para>
                    <Box align="center" flex="grow">
                        <Btn label={"Random morph"} onClick={() => disp.random()} />
                    </Box>
                </Box>

                <Card morph={disp.morph} />
            </Box>
        </>
    );
});
