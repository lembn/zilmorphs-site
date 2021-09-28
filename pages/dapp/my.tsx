import { observer } from "mobx-react-lite";
import { Box, Heading } from "grommet";
import { useRouter } from "next/router";
import { makeAutoObservable, runInAction } from "mobx";
import { ApiMorph } from "../../data/interfaces";
import { useEffect } from "react";
import { Card } from "../../components/Card";
import { walletManager } from "../../state/WalletManager";
import { Footer } from "../../components/Main/Footer";

export class DispMultiple {
    morphs: ApiMorph[] = [];
    constructor() {
        makeAutoObservable(this);
    }

    async get(...ids: string[]) {
        try {
            const res = await fetch("/api/morph/batch", {
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ ids }),
                method: "POST",
            });
            const data = await res.json();
            runInAction(() => {
                this.morphs = data;
            });
        } catch (e) {
            console.error(e);
        }
    }
}

const multiple = new DispMultiple();

export default observer(() => {
    useEffect(() => {
        multiple.get(...walletManager.owned);
    }, [walletManager.owned]);

    return (
        <>
            <Box flex="grow" justify="center" gap="medium">
                <Box
                    height="medium"
                    width="medium"
                    gap="medium"
                    align="center"
                    pad="large"
                    fill
                    wrap
                >
                    {multiple.morphs.length == 0 ? (
                        <Heading level="2">{`you have no morphs :(`}</Heading>
                    ) : (
                        multiple.morphs.map((m) => (
                            <Card morph={m} key={m.num} />
                        ))
                    )}
                </Box>
            </Box>
            <Footer />
        </>
    );
});
