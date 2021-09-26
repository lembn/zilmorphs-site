import { observer } from "mobx-react-lite";
import { Box, Button } from "grommet";
import { LiveStats } from "../components/LiveStats";
import { useRouter } from "next/router";
import { Hero } from "../components/Hero";
import { Triangles } from "../three/App";
import { useEffect, useState } from "react";

export default observer(() => {
    const router = useRouter();

    return (
        <Box fill>
            <Triangles />
        </Box>
    );
});
