import { observer } from "mobx-react-lite";
import { Box, Grid, Heading, ResponsiveContext } from "grommet";
import { GiCrossedSwords, GiCardRandom } from "react-icons/gi";
import Typewriter from "typewriter-effect";
import router from "next/router";
import React from "react";

export default observer(() => {
  // add responsiveness to the boxes that contain arcade options
  function highlightBox(e) {
    e.target.style.borderWidth = "5px";
  }

  function dehighlightBox(e) {
    e.target.style.borderWidth = "3px";
  }
  // track the size of the window in a variable for resizing components
  const context = React.useContext(ResponsiveContext);

  return (
    <Grid
      alignSelf="center"
      // each item in the array is the size for one specific row/column
      rows={context === "small" ? ["xsmall", "small", "small"] : ["xsmall", "small"]}
      columns={context === "small" ? ["small", "small"] : ["medium", "medium"]}
      gap="medium"
      // coordinates are stored as [column coord, row coord], the column coordinates change depending on screen size
      areas={
        context === "small"
          ? [
              { name: "typewriter", start: [0, 0], end: [1, 0] },
              { name: "morphsino", start: [0, 1], end: [0, 1] },
              { name: "battle", start: [0, 2], end: [0, 2] },
            ]
          : [
              { name: "typewriter", start: [0, 0], end: [1, 0] },
              { name: "morphsino", start: [0, 1], end: [0, 1] },
              { name: "battle", start: [1, 1], end: [1, 1] },
            ]
      }
    >
      <Box gridArea="typewriter">
        {/* //type writer effect for the title of the page */}
        <Heading alignSelf="center" margin={"none"}>
          <Typewriter
            options={{
              // strings that are displayed by typewriter
              strings: ["Arcade", "Unleash the beast", "Test your luck", "There is only one Champion", "Exceed your limits", "Evolve"],
              autoStart: true,
              loop: true,
            }}
            onInit={(typewriter) => typewriter.start()}
          />
        </Heading>
      </Box>
      {/* // boxes presenting the options of the arcade */}
      <Box
        margin={context == "small" ? { left: "100px", right: "-100px" } : "none"}
        gridArea="morphsino"
        focusIndicator={false}
        border={{ color: "black", size: "3px", side: "all" }}
        onMouseOver={highlightBox}
        onMouseLeave={dehighlightBox}
        onClick={() => router.push("/dapp/play")}
      >
        <Heading alignSelf="center" margin={"medium"} size={"xsmall"}>
          Morphsino
        </Heading>
        <Heading alignSelf="center" margin={"none"} size={"xsmall"}>
          <GiCardRandom />
        </Heading>
      </Box>
      <Box
        margin={context == "small" ? { left: "100px", right: "-100px" } : "none"}
        gridArea="battle"
        focusIndicator={false}
        border={{ color: "black", size: "3px", side: "all" }}
        onMouseOver={highlightBox}
        onMouseLeave={dehighlightBox}
        onClick={() => router.push("/dapp/battle")}
      >
        <Heading alignSelf="center" margin={"medium"} size={"xsmall"}>
          Battle
        </Heading>
        <Heading alignSelf="center" margin={"none"} size={"xsmall"}>
          <GiCrossedSwords />
        </Heading>
      </Box>
    </Grid>
  );
});
