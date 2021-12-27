import { Box } from "grommet";
import { Card } from "../components/Card";
import { Heading } from "grommet";
import { Para } from "../components/Para";
import { observer } from "mobx-react-lite";
import { DispMultiple } from "../state/DispMultiple";
import { useEffect } from "react";

const multiple = new DispMultiple();

export default observer(function Press() {
    useEffect(() => {
        multiple.get("1436", "5345", "3243", "7654");
    }, []);

    return (
        <Box flex="grow" justify="center" pad="small" align="center" gap="large">
            <Box align="center" width={{ max: "350px" }} flex="grow">
                <Heading level="2">Zilmorphs Press</Heading>
                <Heading level="3">Lore</Heading>
                <Para>
                    Zillqa bridge has echoed across the multiverse. The balance was disturbed! Two worlds colided and
                    now 8000 zilmorphs have invaded our dimension! You can only get them with assets from the other
                    worlds: #zWBTC, #zETH, #zUSDT.
                </Para>
                <Para>
                    Zilmorphs have bridged into our world. One can aquire them only by bridging with the other worlds
                    themselves #zWBTC, #zETH, #zUSDT.
                </Para>
                <Para>
                    Zilmorphs come from an alternate reality, that is much more advanced then ours, they managed to
                    entirely digitalize themselves and live on the #Zilliqa blockchain.
                </Para>
                <Para>
                    Zilmorphs are so advanced in fact that in their world they have been created by machines! Machine
                    learning has created zilmorphs!
                </Para>
                <Para>
                    The portal is unstable! Zilmorphs are here for a limited time! The sale will end at a random time
                    and the remaining zimorphs will be trapped in the other worlds forever!
                </Para>
                <Heading level="3">How to buy</Heading>
                <Para>
                    The zilmorph sale will commence shortly after sufficient awareness is gained, so that one cannot
                    frontrun others and grab all of the morphs at the begining!
                </Para>
                <Para>
                    You can only buy morphs with the Zilliqa bridge assets zWBTC, zETH, zUSDT. The morphs starting price
                    is ~1$ in the other worldly assets, each next morph is 1$ more, the earlier you buy the cheaper!
                </Para>
                <Para>
                    There are 3 marketplaces for morphs all have an equivalent starting price of ~1$ that increases by
                    1$ in each respective asset. There are 8000 zilmorphs up for grabs!
                </Para>
                <Para>The sale once started can end at any time!</Para>
                <Heading level="3">Why to buy</Heading>
                <Para>
                    Owning a Zilmorph makes you eligible for zilmorph airdrops, we will be doing that with the 100
                    zilmorphs we reserved from the 8000 existing.
                </Para>
                <Para>
                    Owning a Zilmorph will allow you to take part in upcoming RNG games with $ZIL prices. Zilmorph with
                    better Strength Agility or Inteligence stats will increase your chances in the games.
                </Para>
                <Para>
                    Zillmorphs are scarce, there is only 8000 of them, and they get more expensive very fast! Each next
                    zilmorph is around 1$ more than the previous, with a starting price of 1$.
                </Para>
                <Para>
                    Zilmorphs were created by machine learning algorithms trained on pixel art and are unique! Zilmorph
                    names were also created by machine learning!
                </Para>
                <Heading level="3">Roadmap</Heading>
                <Para>Zimorphs will be sold for the Zilliqa bridge assets zWBTC, zETH, zUSDT.</Para>
                <Para>
                    Zilmorph airdrops for zilmorph owners! (Using the 100 zilmorphs reserved for marketing purposes)
                </Para>
                <Para>Zilmorphs join a NFT marketplace!</Para>
                <Para>
                    Zilmorphs release RNG games with $ZIL prices, having a stronger zilmorph (more agility, strength or
                    inteligence) will increase your chances in the games!
                </Para>
            </Box>
            <Heading level="2">Example morphs</Heading>

            {multiple.morphs.map((m) => (
                <Card morph={m} key={m.num} />
            ))}
        </Box>
    );
});
