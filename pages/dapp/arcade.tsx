import { Box, Grid, Heading, ResponsiveContext } from "grommet";
import { GiCrossedSwords, GiCardRandom } from "react-icons/gi";
import Typewriter from "typewriter-effect";
import router from "next/router";
import React, { useContext } from "react";

export default function arcade() {
  const bpSize = useContext(ResponsiveContext);

  function Game({ name, inner }: { name: string; inner: React.ReactNode }) {
    return (
      <Box
        margin={bpSize == "small" ? { left: "100px", right: "-100px" } : "none"}
        gridArea={name.toLowerCase()}
        focusIndicator={false}
        border={{ color: "black", size: "3px", side: "all" }}
        onMouseOver={(e) => ((e.target as HTMLElement).style.borderWidth = "5px")}
        onMouseLeave={(e) => ((e.target as HTMLElement).style.borderWidth = "3px")}
        onClick={() => router.push(`/dapp/${name.toLowerCase()}`)}
      >
        <Heading alignSelf="center" margin="medium" size="xsmall">
          {name}
        </Heading>
        <Heading alignSelf="center" margin="none" size="xsmall">
          {inner}
        </Heading>
      </Box>
    );
  }

  return (
    <>
      <Heading alignSelf="center">
        <Typewriter
          options={{
            strings: ["Arcade", "Unleash the beast", "Test your luck", "There is only one Champion", "Exceed your limits", "Evolve"],
            autoStart: true,
            loop: true,
          }}
          onInit={(typewriter) => typewriter.start()}
        />
      </Heading>

      <Grid
        alignSelf="center"
        // each item in the array is the size for one specific row/column
        rows={bpSize == "small" ? ["xsmall", "small", "small"] : ["xsmall", "small"]}
        columns={bpSize == "small" ? ["small", "small"] : ["medium", "medium"]}
        gap="medium"
        // coordinates are stored as [column coord, row coord], the column coordinates change depending on screen size
        areas={
          bpSize == "small"
            ? [
                { name: "morphsino", start: [0, 1], end: [0, 1] },
                { name: "battle", start: [0, 2], end: [0, 2] },
              ]
            : [
                { name: "morphsino", start: [0, 1], end: [0, 1] },
                { name: "battle", start: [1, 1], end: [1, 1] },
              ]
        }
      >
        <Game name="Morphsino" inner={<GiCardRandom />} />
        <Game name="Battle" inner={<GiCrossedSwords />} />
      </Grid>
    </>
  );
}
