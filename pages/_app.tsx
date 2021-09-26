import { monitor } from "../util/ContractMonitor";
import { statsDisp } from "../state/StatsDisp";
import { buyer } from "../state/Buyer";
import { Grommet, grommet as grommetTheme, Box } from "grommet";
import { deepMerge } from "grommet/utils";
import { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import { Main } from "../components/Main";

const desc = "KAT The first Zilliqa bonding curve token";
const title = "KAT";
const twitterUrl = "https://kat-indol.vercel.app/";

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    useEffect(() => {
        const u1 = monitor.subscribe();
        const u2 = statsDisp.subscribe();
        return () => {
            u2();
            u1();
        };
    }, []);
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
                />
                <meta name="msapplication-TileColor" content="#ffffff" />
                <meta name="theme-color" content="#ffffff" />
                <meta name="msapplication-tap-highlight" content="no" />
                <meta name="application-name" content={title} />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta
                    name="apple-mobile-web-app-status-bar-style"
                    content="default"
                />
                <meta name="apple-mobile-web-app-title" content={title} />
                <meta name="description" content={desc} />
                <meta name="format-detection" content="telephone=no" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:url" content={twitterUrl} />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={desc} />
            </Head>
            <Grommet
                theme={deepMerge(grommetTheme, {
                    global: {
                        font: {
                            family: "Courier",
                        },
                        colors: { text: "#000000", border: "#000000" },
                    },
                    heading: { color: "#000000" },
                })}
                full={true}
            >
                <Component {...pageProps} />
            </Grommet>
        </>
    );
}
