import { observer } from "mobx-react-lite";
import { Box, Button, Text, Heading } from "grommet";
import { LiveStats } from "../components/LiveStats";
import { useRouter } from "next/router";
import { Hero } from "../components/Hero";
import { useEffect, useState } from "react";

const Symbol = (t: string) =>
    function () {
        return (
            <Box flex="grow" background="red">
                <Heading>{t}</Heading>
            </Box>
        );
    };

const Bell = Symbol("🔔");
const Horseshoe = Symbol("🧲");
const Spades = Symbol("♠️");
const Diamond = Symbol("💎");
const Hearts = Symbol("💞");
const Star = Symbol("⭐");

export default observer(() => {
    const router = useRouter();
    return (
        <Box flex="grow" align="center" justify="center">
            <Box direction="row">
                <Horseshoe />
                <Horseshoe />
                5 cents
            </Box>
            <Box direction="row">
                <Horseshoe />
                <Horseshoe />
                <Star />
                10 cents
            </Box>
            <Box direction="row">
                <Spades />
                <Spades />
                <Spades />
                20 cents
            </Box>
            <Box direction="row">
                <Diamond />
                <Diamond />
                <Diamond />
                30 cents
            </Box>
            <Box direction="row">
                <Hearts />
                <Hearts />
                <Hearts />
                40 cents
            </Box>
            <Box direction="row">
                <Bell />
                <Bell />
                <Bell />
                50 cents
            </Box>
        </Box>
    );
});
